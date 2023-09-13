import { v4 as uuidv4 } from "uuid";
import test1 from '../../features/img/illustration/test1.png'
import test2 from '../../features/img/illustration/test2.jpg'
import test3 from '../../features/img/illustration/test3.jpg'
import test4 from '../../features/img/illustration/test4.jpg'
import test5 from '../../features/img/illustration/test5.jpg'
import test6 from '../../features/img/illustration/test6.jpg'

const Testimonial_data = [
  {
    id: uuidv4(),
    name: 'Shirley',
    img_src: test1,
    testimonial: 'I was lonely back then, my close friends had all started relationships except for me :( So I tried using SOULCLICK, hoping to match someone. To my surprise, it was the best app ever, I met my boyfriend here and we are going to get married upcoming December! Thank you for bringing us together!',
  },
  {
    id: uuidv4(),
    name: 'Katlyn Chua',
    img_src: test2,
    testimonial: 'Thanks to SOULCLICK I have found the love of my life! Little did I expect that I will find my Mr. Right here HAHAH. (I am a introvert girl btw!)',
  },
  {
    id: uuidv4(),
    name: 'Meiyi Ng',
    img_src: test3,
    testimonial: 'THANK YOU FOR MAKING IT POSSIBLE to meet my soulmate! Its really crazy how an app can bring two person together!',
  },
  {
    id: uuidv4(),
    name: 'Jason Liao',
    img_src: test4,
    testimonial: 'Met my girlfriend here! soon to be my WIFEY. It was damn crazy, able to match your partner who have the same interest/hobbies as well as other stuff. Its like perfect match. Really grateful!',
  },
  {
    id: uuidv4(),
    name: 'Kelly Wakasa',
    img_src: test5,
    testimonial: "GIRLFRIEND HEHE FTW MAN",
  },
  {
    id: uuidv4(),
    name: 'Tatum Curry',
    img_src: test6,
    testimonial: 'Met my girlfriend here! soon to be my WIFEY. It was damn crazy, able to match your partner who have the same interest/hobbies as well as other stuff. Its like perfect match. Really grateful!',
  },
  
];

export default Testimonial_data;
