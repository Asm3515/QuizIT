import { Link } from 'react-router-dom';
import error_animation from '../assets/lottie/error_404.lottie';
import { DotLottiePlayer } from '@dotlottie/react-player';

export function ErrorPage() {
    return (
        <div>
            <DotLottiePlayer className='big-lottie-animation' src={error_animation} autoplay loop />
            <Link to="/"><button className='button'>Go Back Home</button></Link>
        </div>
    );
}