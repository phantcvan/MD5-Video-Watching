import { useEffect, useState } from "react";

interface DesProp {
  setDescription: React.Dispatch<React.SetStateAction<string>>,
  setSelectInput: React.Dispatch<React.SetStateAction<number>>,
  selectInput: number,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  description: string,
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Description = ({ setDescription, setSelectInput, selectInput, setMessage, description, setIsChange }: DesProp) => {
  const [countText, setCountText] = useState(0);
  const [maxText, setMaxText] = useState(false)
  useEffect(() => {
    setCountText(description?.length)
  }, [description])
  const handleAddDes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.replace(/\s+/g, " ");
    if (value !== " " && countText < 5000) {
      setCountText(event.target.value.length);
      setDescription(event.target.value);
      setMessage("");
      setIsChange(true)
    }
    if (countText >= 5000) {
      setMaxText(true)
    }
  };
  console.log("maxText", maxText);

  return (
    <div
      className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full my-2
                 ${selectInput === 2 ? "border-[#3EA6FF]" : "border-yt-gray"}
                `}
    >
      <label className={`${selectInput === 2 && "text-[#3EA6FF]"}`}>
        Description (required)
      </label>
      <textarea
        rows={2}
        name="description" value={description}
        required
        className="bg-yt-light-2 text-yt-white outline-none w-full resize-none mt-2"
        onChange={handleAddDes}
        onClick={() => setSelectInput(2)}
      />
      <span className={`text-right ${maxText && "text-yt-red"}`}>{countText}/5000</span>
    </div>
  )
}

export default Description