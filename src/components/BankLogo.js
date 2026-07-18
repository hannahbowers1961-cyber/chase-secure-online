export default function BankLogo({ className = "w-10 h-10" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Right Wedge */}
      <path d="M 42 0 L 70 0 L 100 30 L 100 36 L 42 36 Z" />
      {/* Bottom Right Wedge */}
      <path d="M 64 42 L 100 42 L 100 70 L 70 100 L 64 100 Z" />
      {/* Bottom Left Wedge */}
      <path d="M 58 100 L 30 100 L 0 70 L 0 64 L 58 64 Z" />
      {/* Top Left Wedge */}
      <path d="M 36 58 L 0 58 L 0 30 L 30 0 L 36 0 Z" />
    </svg>
  );
}