const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { Button } = require('../Button');

describe('Button', () => {
  const handleClick = jest.fn();
  
  beforeEach(() => {
    handleClick.mockClear();
  });

  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('rounded-md');
    expect(button).not.toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary</Button>);
    
    const button = screen.getByRole('button', { name: /primary/i });
    
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button', { name: /secondary/i });
    
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-800');
  });

  it('renders with danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    
    const button = screen.getByRole('button', { name: /danger/i });
    
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    
    const button = screen.getByRole('button', { name: /outline/i });
    
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-gray-300');
    expect(button).toHaveClass('bg-transparent');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    
    const button = screen.getByRole('button', { name: /small/i });
    
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1');
    expect(button).toHaveClass('text-sm');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    
    const button = screen.getByRole('button', { name: /large/i });
    
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });

  it('renders as disabled', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('renders with full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button', { name: /full width/i });
    
    expect(button).toHaveClass('w-full');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    
    const button = screen.getByRole('button', { name: /custom class/i });
    
    expect(button).toHaveClass('custom-class');
  });

  it('renders with start icon', () => {
    const StartIcon = () => <span data-testid="start-icon">🔍</span>;
    
    render(<Button startIcon={<StartIcon />}>Search</Button>);
    
    const button = screen.getByRole('button', { name: /search/i });
    const startIcon = screen.getByTestId('start-icon');
    
    expect(button).toContainElement(startIcon);
    expect(button.firstChild).toBe(startIcon);
  });

  it('renders with end icon', () => {
    const EndIcon = () => <span data-testid="end-icon">→</span>;
    
    render(<Button endIcon={<EndIcon />}>Next</Button>);
    
    const button = screen.getByRole('button', { name: /next/i });
    const endIcon = screen.getByTestId('end-icon');
    
    expect(button).toContainElement(endIcon);
    expect(button.lastChild).toBe(endIcon);
  });

  it('renders with loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button', { name: /loading/i });
    const spinner = button.querySelector('[role="status"]');
    
    expect(button).toHaveClass('opacity-70');
    expect(button).toHaveClass('cursor-not-allowed');
    expect(spinner).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onClick when disabled', () => {
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as a link when href is provided', () => {
    render(<Button href="/about">About</Button>);
    
    const link = screen.getByRole('link', { name: /about/i });
    
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
    expect(link).toHaveClass('inline-flex');
    expect(link).toHaveClass('items-center');
    expect(link).toHaveClass('justify-center');
  });

  it('renders with custom component', () => {
    const CustomComponent = React.forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} data-testid="custom-component" {...props}>
        {children}
      </div>
    ));
    
    render(
      <Button as={CustomComponent}>
        Custom Component
      </Button>
    );
    
    const customComponent = screen.getByTestId('custom-component');
    
    expect(customComponent).toBeInTheDocument();
    expect(customComponent).toHaveTextContent('Custom Component');
    expect(customComponent).toHaveClass('inline-flex');
    expect(customComponent).toHaveClass('items-center');
    expect(customComponent).toHaveClass('justify-center');
  });
});
