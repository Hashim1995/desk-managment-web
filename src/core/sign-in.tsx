/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import AppHandledSolidButton from '@/components/forms/button/app-handled-solid-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IGoogleLogin, ILogin, ILoginResponse } from '@/models/user';
import { fetchUserData } from '@/redux/auth/auth-slice';
import { AppDispatch } from '@/redux/store';
import { AuthService } from '@/services/auth-services/auth-services';
import { inputPlaceholderText } from '@/utils/constants/texts';
import { inputValidationText } from '@/utils/constants/validations';

import { useDisclosure } from '@nextui-org/react';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useDarkMode from 'use-dark-mode';
import { useLocalStorage } from 'usehooks-ts';
import LoginBg from '@assets/images/login-bg.png';
import { AcmeLogo } from './logo';

function SignIn() {
  const { t } = useTranslation();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm<ILogin>({
    mode: 'onSubmit',
    defaultValues: {}
  });

  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useDarkMode();

  const onSubmit = async (data: ILogin) => {
    try {
      const res: ILoginResponse = await AuthService.getInstance().login(data);
      if (!res) return;
      if (!userToken) setUserToken({ token: res?.token });
      dispatch(fetchUserData());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const loginWithGoogle = async (data: IGoogleLogin) => {
    try {
      const res: ILoginResponse =
        await AuthService.getInstance().loginWithGoogle(data);
      if (!res) return;
      if (!userToken) setUserToken({ token: res?.token });
      dispatch(fetchUserData());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="flex">
      <div className="md:block relative flex-1 hidden h-screen">
        <div className="top-4 left-4 absolute flex items-center">
          <AcmeLogo color="#252525" />
          <p className="max-sm:hidden font-bold text-black text-lg">ACME</p>
        </div>
        <img src={LoginBg} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-1 justify-center items-center px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col justify-center items-center gap-4 md:pt-24 pb-12 md:pb-20 w-full h-screen md:h-fit">
          {/* Form */}
          <div className="flex items-center md:hidden">
            <AcmeLogo />
            <p className="font-bold text-inherit text-lg">ACME</p>
          </div>
          <div className="mx-auto w-full max-w-sm">
            {/* <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-5"
            >
              <div className="flex flex-col gap-3 md:gap-5">
                <AppHandledInput
                  name="emailOrPhone"
                  inputProps={{
                    id: 'emailOrPhone'
                  }}
                  type="text"
                  control={control}
                  isInvalid={Boolean(errors.emailOrPhone?.message)}
                  errors={errors}
                  size="sm"
                  className="w-full md:w-96"
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(t('email'))
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: `${t('email')} ${t('regexFormatValidatorText')}`
                    }
                  }}
                  label={inputPlaceholderText(t('email'))}
                  required
                />
                <AppHandledInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  inputProps={{
                    id: 'password',
                    endContent: (
                      <button
                        className="focus:outline-none"
                        type="button"
                        aria-label="Show Password"
                        title="Show Password"
                        onClick={() => setShowPassword(z => !z)}
                      >
                        {showPassword ? (
                          <BsEye
                            size={16}
                            className="text-2xl text-default-400 pointer-events-none"
                          />
                        ) : (
                          <BsEyeSlash
                            size={16}
                            className="text-2xl text-default-400 pointer-events-none"
                          />
                        )}
                      </button>
                    )
                  }}
                  control={control}
                  isInvalid={Boolean(errors.password?.message)}
                  errors={errors}
                  size="sm"
                  className="w-full md:w-96"
                  rules={{
                    required: {
                      value: true,
                      message: inputValidationText(t('password'))
                    }
                  }}
                  label={inputPlaceholderText(t('password'))}
                  required
                />
                {/* <div className="flex flex-col space-y-5">
                  <span className="flex justify-start items-center">
                    <span
                      aria-hidden
                      onClick={onOpen}
                      className="font-normal text-sm"
                    >
                      <span
                        className="text-blue-300 cursor-pointer"
                        aria-hidden
                      >
                        {t('forgetPassword')}
                      </span>
                    </span>
                  </span>
                </div> */}
              </div>
              <AppHandledSolidButton
                aria-label="Submit Login Form"
                title="Submit Login Form"
                isLoading={isSubmitting}
                className="!mt-3 md:mt-5 w-full"
                type="submit"
              >
                {t('login')}
              </AppHandledSolidButton>
              {/* <div className="flex justify-center items-center">
                <GoogleLogin
                  width="100%"
                  size="large"
                  ux_mode="popup"
                  onSuccess={credentialResponse => {
                    loginWithGoogle(credentialResponse);
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn;
