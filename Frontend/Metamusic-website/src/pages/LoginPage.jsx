import { DotLottiePlayer } from '@dotlottie/react-player';
import music_animation from '../assets/lottie/music_animation.lottie';
import { Link, Form, redirect } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';


export async function loader() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        return redirect("/");
    }
    return userData;
}

export async function action({ request }) {
    const formData = await request.formData();
    let response = await fetch(`${url}/api/user/login`, {
        method: 'POST',
        body: JSON.stringify({ 'email': formData.get('email'), 'password': formData.get('password') }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS,DELETE',
            'Access-Control-Allow-Credentials': 'true'
        },
    });
    let jsonResponse = await response.json();
    console.log(jsonResponse);
    if (response.status == 200) {
        localStorage.setItem("user", JSON.stringify(jsonResponse));
        return redirect("/");
    }
    else {
        alert(jsonResponse.message);
    }
    return false;
}

export function LoginPage() {

    return (
        <main className='gradient-main no-scroll-bar'>
            <div id="stars"></div>
            <Fade triggerOnce={true}>
                <div className="authentication-container">
                    <DotLottiePlayer className='illustration' src={music_animation} autoplay loop />
                    <Form action={action} method='post'>
                        <h1>Login</h1>
                        <input type="email" id="email" name="email" placeholder='Email' required />
                        <input type="password" id="password" name="password" placeholder='Password' minLength='6' required />
                        <button type="submit">Login</button>
                        <p>Are you new here? <Link to='/signup'>Click here to register</Link></p>
                    </Form>
                </div>
            </Fade>
        </main>
    );
}