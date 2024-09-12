type Props = {
  className?: string;
  name: string;
};

export default function Avatar(props: Props) {
  const { name, className } = props;
  return (
    <div
      className={`flex justify-center items-center rounded-full ${className}`}
    >
      {name ? name.substring(0, 2).toUpperCase() : ''}
    </div>
  );
}
