const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { Input } = require('../Input');

describe('Input', () => {
  const handleChange = jest.fn();
  const handleBlur = jest.fn();
  const handleFocus = jest.fn();
  
  beforeEach(() => {
    handleChange.mockClear();
    handleBlur.mockClear();
    handleFocus.mockClear();
  });

  it('renders with default props', () => {
    render(<Input name="test" />);
    
    const input = screen.getByRole('textbox');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('block w-full rounded-md border-gray-300');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).not.toBeRequired();
    expect(input).not.toBeDisabled();
    expect(input).toHaveValue('');
  });

  it('handles value changes', () => {
    render(<Input name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('handles blur event', () => {
    render(<Input name="test" onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles focus event', () => {
    render(<Input name="test" onFocus={handleFocus} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('renders with label', () => {
    render(<Input name="test" label="Test Label" />);
    
    const label = screen.getByText(/test label/i);
    const input = screen.getByRole('textbox');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
  });

  it('renders with help text', () => {
    render(<Input name="test" helpText="This is help text" />);
    
    const helpText = screen.getByText(/this is help text/i);
    
    expect(helpText).toBeInTheDocument();
    expect(helpText).toHaveClass('text-sm text-gray-500');
  });

  it('renders with error state', () => {
    render(
      <Input
        name="test"
        error="This field is required"
        touched={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    const error = screen.getByText(/this field is required/i);
    
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('focus:ring-red-500');
    expect(input).toHaveClass('focus:border-red-500');
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass('text-red-600');
  });

  it('renders with success state', () => {
    render(
      <Input
        name="test"
        successMessage="Looks good!"
        isValid={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    const success = screen.getByText(/looks good/i);
    
    expect(input).toHaveClass('border-green-500');
    expect(input).toHaveClass('focus:ring-green-500');
    expect(input).toHaveClass('focus:border-green-500');
    expect(success).toBeInTheDocument();
    expect(success).toHaveClass('text-green-600');
  });

  it('renders as required', () => {
    render(<Input name="test" required />);
    
    const input = screen.getByRole('textbox');
    
    expect(input).toBeRequired();
  });

  it('renders as disabled', () => {
    render(<Input name="test" disabled />);
    
    const input = screen.getByRole('textbox');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('renders with custom className', () => {
    render(<Input name="test" className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('custom-class');
  });

  it('renders with different types', () => {
    const { rerender } = render(<Input name="test" type="email" />);
    
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input name="test" type="password" />);
    expect(input).toHaveAttribute('type', 'password');
    
    rerender(<Input name="test" type="number" />);
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders with prefix and suffix', () => {
    render(
      <Input
        name="test"
        prefix="https://"
        suffix=".com"
      />
    );
    
    const prefix = screen.getByText('https://');
    const suffix = screen.getByText('.com');
    const input = screen.getByRole('textbox');
    
    expect(prefix).toBeInTheDocument();
    expect(suffix).toBeInTheDocument();
    expect(input.previousSibling).toContainElement(prefix);
    expect(input.nextSibling).toContainElement(suffix);
  });

  it('renders with left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
    const RightIcon = () => <span data-testid="right-icon">✓</span>;
    
    render(
      <Input
        name="test"
        leftIcon={<LeftIcon />}
        rightIcon={<RightIcon />}
      />
    );
    
    const leftIcon = screen.getByTestId('left-icon');
    const rightIcon = screen.getByTestId('right-icon');
    const input = screen.getByRole('textbox');
    
    expect(leftIcon).toBeInTheDocument();
    expect(rightIcon).toBeInTheDocument();
    expect(input.previousSibling).toContainElement(leftIcon);
    expect(input.nextSibling).toContainElement(rightIcon);
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef();
    render(<Input name="test" ref={ref} />);
    
    const input = screen.getByRole('textbox');
    
    expect(ref.current).toBe(input);
  });

  it('renders with custom input component', () => {
    const CustomInput = React.forwardRef((props, ref) => (
      <input
        ref={ref}
        data-testid="custom-input"
        {...props}
      />
    ));
    
    render(<Input name="test" as={CustomInput} />);
    
    const input = screen.getByTestId('custom-input');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'test');
  });
});
