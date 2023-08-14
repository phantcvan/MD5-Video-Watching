import { useEffect, useState } from "react";
import { AllTags } from "../../static/type";


interface TagProp {
  setTags: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectInput: React.Dispatch<React.SetStateAction<number>>,
  selectInput: number,
  tags: string[],
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>,
  title: string
}

const Tag = ({ setSelectInput, selectInput, setTags, tags, setMessage, setIsChange,title }: TagProp) => {
  const [tag, setTag] = useState("");
  const [forKid, setForKid] = useState(false);

  useEffect(() => {
    if (tags.length > 0) {
      const tagWithoutKidLabel = tags.filter((tag: string) => tag !== "this is a content for kid")
      const tagString = tagWithoutKidLabel.join(", ")
      setTag(tagString);
      const tagFilter = tags.filter((tag: string) => tag === 'this is a content for kid')
      if (tagFilter.length > 0) {
        setForKid(true)
      }
    }
  }, [title])

  const handleAddTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tagValue = e.target.value.replace(/\s+/g, " ");
    let inputTag = e.target.value
    setTag(inputTag);
    if (tagValue) {
      setMessage("");
      setIsChange(true)
      setTags(
        inputTag
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "")
      );
      if (forKid && !tagValue.split(",").includes("this is a content for kid")) {
        setTags([
          ...tagValue
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== ""),
          "this is a content for kid",
        ]);
      } else if (!forKid && tags.includes("this is a content for kid")) {
        const newTags = tags.filter((tag) => tag !== "this is a content for kid");
        setTags(newTags);

      }
    }
  };
  const handleUpdateTagForKid = () => {
    setForKid(true);
    if (!tags.includes("this is a content for kid")) setTags([...tags, "this is a content for kid"]);
  };
  const handleUpdateTagNotForKid = () => {
    setForKid(false);
    if (tags.includes("this is a content for kid")) setTags(tags.filter((tag) => tag !== "this is a content for kid"));
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
          name="tags" value={tag}
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
            checked={forKid}
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
            checked={!forKid}
          />
          <label htmlFor="forKid">No, it's not 'Made for Kids'</label>
        </div>
      </div>
    </div>
  )
}

export default Tag