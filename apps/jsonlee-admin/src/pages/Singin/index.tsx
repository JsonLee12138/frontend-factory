import { useCallback, useEffect, useMemo } from 'react';
import { Button, Form, Image, Input, message, Spin } from 'antd';
import { getBotCheckCode, signin } from '@/api/modules/base.ts';
import Base from '@/types/api_modules/base.ts';
import { md5 } from 'js-md5';
import { setAccessToken } from '@/store/modules/user.ts';
import { useBoolean, useSafeState } from 'ahooks';
import { useAppDispatch } from '@/hooks/store';
import { useNavigate } from 'react-router-dom';

const captchaFormItem = {
  name: 'captcha',
  label: '验证码',
  type: 'captcha',
  isCaptcha: true,
  placeholder: '请输入验证码',
  rules: [{ required: true, message: '请输入验证码' }],
};

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
];

export const Singin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [captchaLoading, { set: setCaptchaLoading }] = useBoolean(false);
  const [captchaURL, setCaptchaURL] = useSafeState<string>('');
  const [captchaId, setCaptchaId] = useSafeState<string>();
  const [captchaAble, { set: setCaptchaAble }] = useBoolean(false);
  const [submitLoading, { set: setSubmitLoading }] = useBoolean(false);
  const [init, { set: setInit }] = useBoolean(false);
  const signinFormList = useMemo(() => {
    if (captchaAble) {
      return [...formList, captchaFormItem];
    }
    return formList;
  }, [captchaAble]);
  const refreshBotCheckCode = useCallback(async () => {
    try {
      setCaptchaLoading(true);
      const { data } = await getBotCheckCode();
      setCaptchaId(data.id);
      setCaptchaURL(data.picPath);
      setCaptchaAble(data.enable);
      // if (data.enable) {
      //   this.setState({
      //     formList: [...formList, captchaFormItem],
      //   });
      // }
    } catch (error) {
    } finally {
      setCaptchaLoading(false);
    }
  }, []);
  const handleSubmit = useCallback(
    async (values: Base.SinginDTO) => {
      try {
        setSubmitLoading(true);
        const password = md5(values.password);
        const { data } = await signin({
          ...values,
          password,
          captchaId: captchaId!,
        });
        message.success('登录成功!');
        dispatch(setAccessToken(data.accessToken));
        navigate(data.defaultRouter);
      } catch (e) {
        refreshBotCheckCode();
      } finally {
        requestAnimationFrame(() => {
          setSubmitLoading(false);
        });
      }
    },
    [captchaAble, captchaId, dispatch, navigate, refreshBotCheckCode],
  );
  useEffect(() => {
    refreshBotCheckCode();
    setInit(true);
  }, []);
  return (
    <div
      className={
        'w-screen h-screen overflow-hidden flex justify-center items-center'
      }
    >
      <Form
        onFinish={handleSubmit}
        className={`w-[400px] shadow rounded p-5 transition-all duration-500 overflow-hidden ease-in-out ${!init && 'py-0 opacity-0 h-0'}`}
        style={{ maxHeight: init ? '100vh' : '0' }}
      >
        <h2 className={'text-center font-bold text-2xl mb-6'}>
          欢迎来到 Json Admin 系统
        </h2>
        {/* <TransitionGroup> */}
        {signinFormList.map((item) => (
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
                {captchaAble && (
                  <Spin spinning={captchaLoading} wrapperClassName={'h-10'}>
                    <Image
                      width={100}
                      height={40}
                      preview={false}
                      className={'rounded-lg cursor-pointer border'}
                      src={captchaURL}
                      onClick={refreshBotCheckCode}
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
            loading={submitLoading}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Singin;
