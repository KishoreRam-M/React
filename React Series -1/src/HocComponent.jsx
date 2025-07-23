import React from 'react';

const HocComponent = () => {
  // 🎯 Higher Order Component function
  function greeting(WrappedComponent) {
    return function EnhancedComponent(props) {
      return <WrappedComponent {...props} />;
    };
  }

  // 🎯 Component to wrap
  const BasicComponent = ({ message }) => {
    return <div className="hi">Message: {message}</div>;
  };

  // 🎯 Enhanced Component using HOC
  const EnhancedComponent = greeting(BasicComponent);

  return (
    <>
      <EnhancedComponent message="I love you 💖" />
    </>
  );
};

export default HocComponent;
