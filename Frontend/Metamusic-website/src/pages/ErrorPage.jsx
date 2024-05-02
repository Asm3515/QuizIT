import { Link } from 'react-router-dom';
import error_animation from '../assets/lottie/error_404.lottie';
import { DotLottiePlayer } from '@dotlottie/react-player';

export function ErrorPage() {
    return (
        <div className='overscroll-y-none'>
            <DotLottiePlayer className='h-screen m-px' src={error_animation} autoplay loop />
            <Link to="/"><button className='button'>Go Back Home</button></Link>
        </div>
    );
}