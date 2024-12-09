export const ListWithIcon = ({ title }: { title: string }) => {
  return (
    <ul className="space-y-2">
      <h6 className="text-sm font-semibold text-primary xl:text-2xl">{title}</h6>
      <ListItem text={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, ipsa."} />
      <ListItem text={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab, ipsa."} />
    </ul>
  );
};

export default function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center space-x-2">
      <svg
        className="flex-shrink-0 self-start w-3.5 h-3.5 text-secondary mt-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 12"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 5.917 5.724 10.5 15 1.5"
        />
      </svg>
      <p className="text-sm font-medium lg:text-base xl:text-xl">{text}</p>
    </li>
  );
}
