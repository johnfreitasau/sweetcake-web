// import React, { useCallback, useRef } from 'react';
// import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
// import { Form } from '@unform/web';
// import { FormHandles } from '@unform/core';
// import * as Yup from 'yup';
// import { Link, useHistory } from 'react-router-dom';

// import api from '../../services/api';
// import { useToast } from '../../hooks/toast';

// import getValidationErrors from '../../utils/getValidationErrors';

// import logoImg from '../../assets/cupcake-img.svg';

// import Input from '../../components/Form/Input';
// import Button from '../../components/Form/Button';

// import { Container, Content, AnimationContainer } from './styles';

// interface SignUpFormData {
//   name: string;
//   email: string;
//   password: string;
// }

// const SignUp: React.FC = () => {
//   const formRef = useRef<FormHandles>(null);
//   const { addToast } = useToast();
//   const history = useHistory();

//   const handleSubmit = useCallback(
//     async (data: SignUpFormData) => {
//       formRef.current?.setErrors({});

//       try {
//         const schema = Yup.object().shape({
//           name: Yup.string().required(),
//           email: Yup.string()
//             .required('Name is required.')
//             .email('Digit a valid e-mail.'),
//           password: Yup.string().required('Password required.'),
//         });

//         await schema.validate(data, { abortEarly: false });

//         await api.post('/users', data);

//         history.push('/');

//         addToast({
//           type: 'success',
//           title: 'User created successfully.',
//           description: 'User is now able to Login to the application.',
//         });
//       } catch (err) {
//         if (err instanceof Yup.ValidationError) {
//           const errors = getValidationErrors(err);

//           formRef.current?.setErrors(errors);

//           return;
//         }
//         addToast({
//           type: 'error',
//           title: 'SignUp Error',
//           description: 'Issues to create a new user. Please try again.',
//         });
//       }
//     },
//     [addToast, history],
//   );

//   return (
//     <>
//       <Container>
//         <Content>
//           <AnimationContainer>
//             <h1>Create new user</h1>

//             <Form ref={formRef} onSubmit={handleSubmit}>
//               <h2>Registration</h2>

//               <Input name="name" icon={FiUser} placeholder="Name" />
//               <Input name="email" icon={FiMail} placeholder="E-mail" />
//               <Input
//                 name="password"
//                 icon={FiLock}
//                 type="password"
//                 placeholder="Password"
//               />

//               <Button type="submit">Create new user</Button>
//             </Form>

//             <Link to="/">
//               <FiArrowLeft />
//               Back
//             </Link>
//           </AnimationContainer>
//         </Content>
//       </Container>
//     </>
//   );
// };

// export default SignUp;

//-----------

import React, { useCallback, useRef, ChangeEvent, useState } from 'react';
import { FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';

import { Content, Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { BackButton, RegisterButton } from '../../components/Form';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  // const handleSubmit = useCallback(
  //   async (data: ProfileFormData) => {
  //     formRef.current?.setErrors({});

  //     try {
  //       const schema = Yup.object().shape({
  //         name: Yup.string().required(),

  //         email: Yup.string()
  //           .required('Name is required.')
  //           .email('Digit a valid e-mail.'),

  //         oldPassword: Yup.string(),

  //         password: Yup.string().when('oldPassword', {
  //           is: (val) => !!val.length,
  //           then: Yup.string().required('Field is required.'),
  //           otherwise: Yup.string(),
  //         }),

  //         password_confirmation: Yup.string()
  //           .when('oldPassword', {
  //             is: (val) => !!val.length,
  //             then: Yup.string().required('Field is required.'),
  //             otherwise: Yup.string(),
  //           })
  //           .oneOf([Yup.ref('password')], 'The confirmation is incorrect.'),
  //       });

  //       await schema.validate(data, { abortEarly: false });

  //       const {
  //         name,
  //         email,
  //         oldPassword,
  //         password,
  //         password_confirmation,
  //       } = data;

  //       console.log('DATA:', data);
  //       console.log(
  //         'DATA DETAILED:',
  //         name,
  //         email,
  //         oldPassword,
  //         password,
  //         password_confirmation,
  //       );

  //       const formData = {
  //         name,
  //         email,
  //         ...(oldPassword
  //           ? {
  //               oldPassword,
  //               password,
  //               password_confirmation,
  //             }
  //           : {}),
  //       };

  //       const response = await api.put('/profile', formData);

  //       console.log('RESPONSE', response);

  //       updateUser(response.data);

  //       history.push('/orders');

  //       addToast({
  //         type: 'success',
  //         title: 'Success!.',
  //         description: 'Your profile has been updated.',
  //       });
  //     } catch (err) {
  //       if (err instanceof Yup.ValidationError) {
  //         const errors = getValidationErrors(err);

  //         formRef.current?.setErrors(errors);

  //         return;
  //       }
  //       addToast({
  //         type: 'error',
  //         title: 'Error',
  //         description:
  //           'Error ocurred with the SignUp update. Please try again.',
  //       });
  //     }
  //   },
  //   [addToast, history, updateUser],
  // );

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string()
            .required('Name is required.')
            .email('Digit a valid e-mail.'),
          password: Yup.string().required('Password required.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'User created successfully.',
          description: 'User is now able to Login to the application.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'SignUp Error',
          description: 'Issues to create a new user. Please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Container>
        <Content>
          <header>
            <h1>Register new user</h1>

            <section>
              <BackButton />
              <RegisterButton
                isLoading={isLoading}
                onClick={handleSubmitButton}
                label="Create"
              />
              {/* <Button type="button" onClick={handleSubmitButton}>
                <FiUserCheck size={20} />
                Update Profile
              </Button> */}
            </section>
          </header>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />
          </Form>
          {/* <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{ marginTop: 24 }}
              name="oldPassword"
              icon={FiLock}
              type="password"
              placeholder="Current Password"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New Password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Password Confirmation"
            /> */}

          {/* <Button type="submit">Update Profile</Button> */}
          {/* </Form> */}
        </Content>
      </Container>
    </>
  );
};

export default SignUp;
