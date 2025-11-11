export default function Container(props: React.PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{props.children}</div>
  );
}
