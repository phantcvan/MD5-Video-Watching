interface TitleProp {
  setSelectInput: React.Dispatch<React.SetStateAction<number>>,
  selectInput: number,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  title: string,
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Title = ({ setSelectInput, selectInput, setTitle, setMessage, title, setIsChange }: TitleProp) => {
  const handleAddTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = e.target.value.replace(/\s+/g, " ");
    // console.log(inputTitle);
    if (inputTitle !== " ") {
      setIsChange(true)
      setTitle(e.target.value);
      setMessage("");
    }
  };

  return (
    <div
      className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full my-2
                 ${selectInput === 1 ? "border-[#3EA6FF]" : "border-yt-gray"}`}>
      <label className={`${selectInput === 1 && "text-[#3EA6FF]"}`}>
        Title (required)
      </label>
      <input
        type="text" value={title}
        name="title"
        required
        className="bg-yt-light-2 text-yt-white outline-none w-full mt-2"
        onChange={handleAddTitle}
        onClick={() => setSelectInput(1)}
      />
    </div>
  )
}

export default Title