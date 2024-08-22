import { Component } from 'react';
import { Button, Form, Image, Input, message, Spin } from 'antd';
import { autoBind } from 'jsonlee-decorator/src';
import { getBotCheckCode, signin } from '@/api/modules/base.ts';
import Base from '@/types/api_modules/base.ts';
import { md5 } from 'js-md5';
import { withRouter, WithRouterProps } from '@/decorator/withRouter.tsx';
import { connect } from '@/decorator/connect.ts';
import { ConnectedProps, RootState } from '@/types/store.ts';
import { setAccessToken, setUserInfo } from '@/store/modules/user.ts';

interface DispatchProps {
  setUserInfo: typeof setUserInfo;
  setAccessToken: typeof setAccessToken;
}

type FinalProps = ConnectedProps<unknown, DispatchProps, WithRouterProps>;

const formList = [
  {
    name: 'account',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    rules: [{ required: true, message: '请输入用户名' }],
  },
  {
    name: 'password',
    label: '密码',
    type: 'password',
    placeholder: '请输入密码',
    rules: [{ required: true, message: '请输入密码' }],
  },
  // {
  //   name: 'captcha',
  //   label: '验证码',
  //   type: 'captcha',
  //   isCaptcha: true,
  //   placeholder: '请输入验证码',
  //   rules: [{ required: true, message: '请输入验证码' }],
  // },
];
const captchaFormItem = {
  name: 'captcha',
  label: '验证码',
  type: 'captcha',
  isCaptcha: true,
  placeholder: '请输入验证码',
  rules: [{ required: true, message: '请输入验证码' }],
};

@connect(
  (state: RootState)=> ({
    userInfo: state.user.userInfo
  }),
  {
    setUserInfo,
    setAccessToken
  }
)
@withRouter
@autoBind
class Singin extends Component<FinalProps> {
  state = {
    captchaLoading: false,
    captchaURL: '',
    captchaId: '',
    useCaptcha: false,
    submitLoading: false,
    formList: [...formList],
    init: false
  };

  constructor(props: FinalProps) {
    super(props);
  }

  async refreshBotCheckCode() {
    try {
      this.setState({
        captchaLoading: true,
      });
      const { data } = await getBotCheckCode();
      this.setState({
        captchaURL: data.picPath,
        captchaId: data.id,
        useCaptcha: data.enable,
      });
      if (data.enable) {
        this.setState({
          formList: [...formList, captchaFormItem],
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* empty */
    } finally {
      this.setState({
        captchaLoading: false,
        // maxHeight: "1000px"
      });
    }
  }

  async handleSubmit(values: Base.SinginDTO) {
    try {
      this.setState({
        submitLoading: true,
      });
      const password = md5(values.password);
      const { data } = await signin({
        ...values,
        password,
        captchaId: this.state.captchaId,
      });
      message.success('登录成功!');
      this.props.setAccessToken!(data.accessToken);
      this.props.navigate!(data.defaultRouter);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.refreshBotCheckCode();
    } finally {
      requestAnimationFrame(()=> {
        this.setState({
          submitLoading: false,
        });
      })
    }
  }

  componentDidMount() {
    this.refreshBotCheckCode();
    this.setState({
      init: true
    });
  }

  render() {
    return (
      <div
        className={
          'w-screen h-screen overflow-hidden flex justify-center items-center'
        }
      >
        <Form
          onFinish={this.handleSubmit}
          className={`w-[400px] shadow rounded p-5 transition-all duration-500 overflow-hidden ease-in-out ${!this.state.init && 'py-0 opacity-0 h-0'}`}
          style={{maxHeight: this.state.init ? '100vh' : '0'}}
        >
          <h2 className={'text-center font-bold text-2xl mb-6'}>
            欢迎来到 Json Admin 系统
          </h2>
          {/* <TransitionGroup> */}
            {this.state.formList.map((item) => (
              // <CSSTransition key={item.name} timeout={10} classNames={'fade'}>
                <Form.Item key={item.name} name={item.name} rules={item.rules}>
                  {item.type === 'password' && (
                    <Input.Password
                      size={'large'}
                      placeholder={item.placeholder || item.label}
                      allowClear
                    />
                  )}
                  {item.type === 'captcha' && (
                    <div className={'flex items-center justify-between'}>
                      <Input
                        placeholder={item.placeholder || item.label}
                        className={'mr-2'}
                        allowClear
                        size={'large'}
                      />
                      {this.state.useCaptcha && (
                        <Spin
                          spinning={this.state.captchaLoading}
                          wrapperClassName={'h-10'}
                        >
                          <Image
                            width={100}
                            height={40}
                            preview={false}
                            className={'rounded-lg cursor-pointer border'}
                            src={this.state.captchaURL}
                            onClick={this.refreshBotCheckCode}
                          />
                        </Spin>
                      )}
                    </div>
                  )}
                  {(!item.type || item.type === 'input') && (
                    <Input
                      placeholder={item.placeholder || item.label}
                      allowClear
                      size={'large'}
                    />
                  )}
                </Form.Item>
              // {/* </CSSTransition> */}
            ))}
          {/* </TransitionGroup> */}
          <Form.Item className={'mb-0'}>
            <Button
              size={'large'}
              htmlType={'submit'}
              className={'w-full bg-blue-500 text-white rounded p-2'}
              loading={this.state.submitLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Singin;
