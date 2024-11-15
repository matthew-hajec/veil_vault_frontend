const Card = ({className, children}) => {
  return (
    <section className={`bg-white rounded-sm shadow-md border border-gray-200 p-4 my-8 ${className}`}>
      {children}
    </section>
  );
}

export default Card;