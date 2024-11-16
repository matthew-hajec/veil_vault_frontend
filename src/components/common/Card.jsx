const Card = ({className, children}) => {
  return (
    <section className={`bg-white rounded-sm shadow-md border border-gray-200 p-4 ${className}`}>
      {children}
    </section>
  );
}

export default Card;