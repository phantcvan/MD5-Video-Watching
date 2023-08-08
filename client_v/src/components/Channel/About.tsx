import { Tooltip, notification } from 'antd';
import { ChannelType } from '../../static/type';
import moment from 'moment';
import { PiShareFatThin } from "react-icons/pi";

interface AboutProp {
  channel: ChannelType | null,
  totalView: number
}
const About = ({ channel, totalView }: AboutProp) => {
  const joinDate = moment(channel?.joinDate).format('MMM DD, YYYY');
  const handleCopy = () => {
    // setMessage("Link copied to clipboard");
    navigator.clipboard.writeText(`http://localhost:5173/channel/${channel?.channelCode}`)
      .then(() => {
        console.log('Link copied to clipboard');
        notification.success({
          message: "Link copied to clipboard",
          style: {
            top: 95,
            zIndex: 50
          },
          duration: 2,
        });
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };
  return (
    <div className='flex text-yt-white gap-10 mx-5'>
      <div className='flex basis-3/4 flex-col'>
        {channel?.about && <div className='flex flex-col'>
          <span className='my-2 text-lg font-semibold'>Description</span>
          <span className='my-2'>{channel?.about}</span>
        </div>}
      </div>
      <div className='flex flex-1 flex-col'>
        <span className='border-b border-b-yt-light-6 py-3'>Stats</span>
        <span className='border-b border-b-yt-light-6 py-3'>Joined {joinDate}</span>
        <span className='border-b border-b-yt-light-6 py-3'>{totalView.toLocaleString()} views</span>
        <Tooltip placement="bottomLeft" title='Share' color='#3F3F3F' arrow={false}>
          <span className='mt-3 p-2 rounded-full hover:bg-yt-light-3 w-fit'
            onClick={handleCopy}>
            <PiShareFatThin size={21} />
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

export default About