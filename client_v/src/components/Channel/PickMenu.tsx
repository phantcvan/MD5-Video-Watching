
interface PickMenuProp {
  setPick: React.Dispatch<React.SetStateAction<number>>,
  pick: number
}
const PickMenu = ({ setPick, pick }: PickMenuProp) => {
  return (
    <div className="border-b border-b-yt-light-3 text-lg font-semibold pb-2">
      <div className="ml-20">
        <span className={`${pick === 1 ? "text-yt-white border-b-2 border-b-yt-white" : "text-yt-light-4"} 
        cursor-pointer pb-2 px-10 hover:text-yt-white`} onClick={() => setPick(1)}>
          HOME
        </span>
        <span className={`${pick === 2 ? "text-yt-white border-b-2 border-b-yt-white" : "text-yt-light-4"} 
        cursor-pointer pb-2 px-10 hover:text-yt-white`} onClick={() => setPick(2)}>
          VIDEOS
        </span>
        <span className={`${pick === 3 ? "text-yt-white border-b-2 border-b-yt-white" : "text-yt-light-4"} 
        cursor-pointer pb-2 px-10 hover:text-yt-white`} onClick={() => setPick(3)}>
          ABOUT
        </span>

      </div>
    </div>
  )
}

export default PickMenu