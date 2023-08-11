import { useState } from "react";


interface TagProp {
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectInput: React.Dispatch<React.SetStateAction<number>>,
  selectInput: number,
  tags: string[],
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

const Tag = ({ setSelectInput, selectInput, setTags, tags, setMessage }: TagProp) => {
  const [tag, setTag] = useState("");
  const [forKid, setForKid] = useState(false);

  const handleAddTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tagValue = e.target.value.replace(/\s+/g, "");
    if (tagValue) {
      setMessage("");
      setTag(e.target.value);
      setTags(
        e.target.value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      );
      if (forKid && !tagValue.split(",").includes("kid")) {
        setTags([
          ...tagValue
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
          "kid",
        ]);
      } else if (!forKid && tags.includes("kid")) {
        const newTags = tags.filter((tag) => tag !== "kid");
        setTags(newTags);
      }
    }
  };
  const handleUpdateTagForKid = () => {
    setForKid(true);
    if (!tags.includes("kid")) setTags([...tags, "kid"]);
  };
  const handleUpdateTagNotForKid = () => {
    setForKid(false);
    if (tags.includes("kid")) setTags(tags.filter((tag) => tag !== "kid"));
  };

  return (
    <div>
      <div
        className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full my-2
                 ${selectInput === 4 ? "border-[#3EA6FF]" : "border-yt-gray"}
                `}
      >
        <label className={`${selectInput === 4 && "text-[#3EA6FF]"}`}>
          Tag (required)
        </label>
        <input
          type="text"
          name="tags"
          required
          placeholder="Enter a comma after each tag"
          className="bg-yt-light-2 text-yt-white outline-none w-full my-2"
          onClick={() => setSelectInput(4)}
          onChange={handleAddTag}
        />
      </div>
      <span className="text-lg font-medium my-2">Audience</span>
      <div className="flex gap-10 my-2">
        <div className="flex gap-2 items-center">
          <input
            type="radio"
            value="kid"
            name="kidOption"
            className="w-4 h-4"
            onChange={handleUpdateTagForKid}
          />
          <label htmlFor="forKid">Yes, it's 'Made for Kids'</label>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="radio"
            value="notForKid"
            name="kidOption"
            className="w-4 h-4"
            onChange={handleUpdateTagNotForKid}
          />
          <label htmlFor="forKid">No, it's not 'Made for Kids'</label>
        </div>
      </div>
    </div>
  )
}

export default Tag