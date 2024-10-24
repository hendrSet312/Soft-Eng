import React from 'react';
import { HeaderLogSign, SignUpForm } from '../components';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-700 flex flex-col items-center gap-32">
      <HeaderLogSign />
      <SignUpForm/>
    </div>
  );
};

export default SignUpPage;
