const React = require('react');
const { render, screen, fireEvent, act } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');
const { Modal } = require('../Modal');

// Mock the document.createRange method used by some components
// that rely on the DOM Range API
const createRange = () => ({
  setStart: jest.fn(),
  setEnd: jest.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

// Mock the document.createRange method
global.document.createRange = createRange;

// Mock the scrollIntoView method
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Modal', () => {
  const handleClose = jest.fn();
  
  beforeEach(() => {
    handleClose.mockClear();
    // Mock the body scroll behavior
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Clean up any modals that might be left in the DOM
    const modals = document.querySelectorAll('.modal-root');
    modals.forEach(modal => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', async () => {
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton>
        <div>Modal Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay', async () => {
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick>
        <div>Modal Content</div>
      </Modal>
    );
    
    const overlay = document.querySelector('.fixed.inset-0');
    await user.click(overlay);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal content', async () => {
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick>
        <div>Modal Content</div>
      </Modal>
    );
    
    const content = screen.getByText('Modal Content');
    await user.click(content);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing the Escape key', async () => {
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape>
        <div>Modal Content</div>
      </Modal>
    );
    
    await user.keyboard('{Escape}');
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when modal is open', () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).not.toBe('hidden');
    
    rerender(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('renders with a title', () => {
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders with a footer', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={handleClose} 
        footer={
          <button>Save Changes</button>
        }
      >
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('applies custom class names', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={handleClose}
        className="custom-modal"
        overlayClassName="custom-overlay"
        contentClassName="custom-content"
        headerClassName="custom-header"
        bodyClassName="custom-body"
        footerClassName="custom-footer"
      >
        <div>Modal Content</div>
      </Modal>
    );
    
    const modal = document.querySelector('.custom-modal');
    const overlay = document.querySelector('.custom-overlay');
    const content = document.querySelector('.custom-content');
    const header = document.querySelector('.custom-header');
    const body = document.querySelector('.custom-body');
    const footer = document.querySelector('.custom-footer');
    
    expect(modal).toBeInTheDocument();
    expect(overlay).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('traps focus inside the modal', async () => {
    const user = userEvent.setup();
    
    render(
      <>
        <button>Outside Button</button>
        <Modal isOpen={true} onClose={handleClose}>
          <div>
            <button>First Button</button>
            <button>Second Button</button>
          </div>
        </Modal>
      </>
    );
    
    // Focus should be on the first focusable element (close button or first button)
    const firstButton = screen.getByRole('button', { name: /first button/i });
    const secondButton = screen.getByRole('button', { name: /second button/i });
    
    await user.tab();
    expect(firstButton).toHaveFocus();
    
    await user.tab();
    expect(secondButton).toHaveFocus();
    
    // Focus should cycle back to the first button
    await user.tab();
    expect(firstButton).toHaveFocus();
    
    // Shift+Tab should cycle backwards
    await user.tab({ shift: true });
    expect(secondButton).toHaveFocus();
  });

  it('renders with loading state', () => {
    render(
      <Modal isOpen={true} onClose={handleClose} loading>
        <div>Modal Content</div>
      </Modal>
    );
    
    const spinner = document.querySelector('[role="status"]');
    expect(spinner).toBeInTheDocument();
    
    const content = screen.getByText('Modal Content');
    expect(content).toHaveClass('opacity-50');
    expect(content).toHaveClass('pointer-events-none');
  });

  it('renders with custom size', () => {
    render(
      <Modal isOpen={true} onClose={handleClose} size="lg">
        <div>Modal Content</div>
      </Modal>
    );
    
    const modal = document.querySelector('.max-w-3xl');
    expect(modal).toBeInTheDocument();
  });

  it('forwards ref to the modal content', () => {
    const ref = React.createRef();
    
    render(
      <Modal isOpen={true} onClose={handleClose} ref={ref}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(ref.current).toBeInTheDocument();
  });

  it('appears and disappears with animations', async () => {
    const { rerender } = render(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Modal should not be in the DOM when closed
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    
    // Open the modal
    rerender(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Modal should be in the DOM when open
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    
    // Close the modal
    rerender(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Modal should be removed from the DOM after animation
    // Note: This test assumes the modal is immediately removed from the DOM
    // In a real scenario, you might need to wait for the animation to complete
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });
});
