import { useLoginForm } from '../../../hooks/useLoginForm';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { SubmitButton } from './SubmitButton';

const LoginForm = () => {
  const {
    credentials,
    isLoading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="space-y-4 sm:space-y-5">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={credentials.email}
          onChange={handleInputChange}
          icon="email"
          required
        />

        <PasswordField
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          required
        />
      </div>

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default LoginForm;