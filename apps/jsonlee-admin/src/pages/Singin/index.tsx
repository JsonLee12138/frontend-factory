import { Component } from 'react';
import { Button, Form, Image, Input, message, Spin } from 'antd';
import { autoBind } from 'jsonlee-decorator/src';
import { getBotCheckCode, singin } from '@/api/modules/base.ts';
import Base from '@/types/api_modules/base.ts';
import { md5 } from 'js-md5';

// interface FormData {
//   username?: string;
//   password?: string;
//   captcha?: string;
// };

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
  {
    name: 'captcha',
    label: '验证码',
    type: 'captcha',
    isCaptcha: true,
    placeholder: '请输入验证码',
    rules: [{ required: true, message: '请输入验证码' }],
  },
];

@autoBind
class Singin extends Component {
  state = {
    captchaLoading: false,
    captchaURL: '',
    captchaId: '',
    useCaptcha: false,
  };

  constructor(props: object) {
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
    } catch (e) {

    } finally {
      this.setState({
        captchaLoading: false,
      });
    }
  }

  async handleSubmit(values: Base.SinginDTO) {
    try{
      const password = md5(values.password);
      const { data } = await singin({...values, password, captchaId: this.state.captchaId});
      message.success('登录成功!');
      console.log(data, "登录成功")
    }catch (e) {
      this.refreshBotCheckCode()
    }
  }

  componentDidMount() {
    this.refreshBotCheckCode()
  }

  render() {
    return (
      <div className={'w-screen h-screen overflow-hidden flex justify-center items-center'}>
        <Form onFinish={this.handleSubmit} className={'w-[400px] shadow rounded p-5'}>
          <h2 className={'text-center font-bold text-2xl mb-6'}>欢迎来到 Json Admin 系统</h2>
          {formList.map(item => (
            <Form.Item key={item.name} name={item.name} rules={item.rules}>
              {item.type === 'password' &&
                <Input.Password size={'large'} placeholder={item.placeholder || item.label} allowClear />
              }
              {
                (item.type === 'captcha' && this.state.useCaptcha) && <div className={'flex items-center justify-between'}>
                  <Input placeholder={item.placeholder || item.label} className={'mr-2'} allowClear size={'large'} />
                  {this.state.useCaptcha && <Spin spinning={this.state.captchaLoading} wrapperClassName={'h-10'}>
                    <Image width={100} height={40} preview={false} className={'rounded-lg cursor-pointer border'}
                           src={this.state.captchaURL} onClick={this.refreshBotCheckCode} />
                  </Spin>}
                </div>
              }
              {
                (!item.type || item.type === 'input') &&
                <Input placeholder={item.placeholder || item.label} allowClear size={'large'} />
              }
            </Form.Item>
          ))}
          <Form.Item className={'mb-0'}>
            <Button size={'large'} htmlType={'submit'} className={'w-full bg-blue-500 text-white rounded p-2'}>登录</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Singin;
