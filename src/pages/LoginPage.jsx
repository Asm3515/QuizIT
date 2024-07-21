import { DotLottiePlayer } from '@dotlottie/react-player';
import music_animation from '../assets/lottie/animate1.lottie';
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
    let response = await fetch(`http://localhost:3001/login`, {
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
        <Fade triggerOnce={true}>
            <div className="h-screen flex items-center justify-center">
                <div className="grid grid-cols-2">
                <DotLottiePlayer className='illustration' src={music_animation} autoplay loop />
                    <div className="flex ml-20 max-half-screen-size flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign In to your account
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <Form className="space-y-6" action={action} method="POST">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email Address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </Form>

                            <p className="mt-10 text-center text-sm text-gray-500">
                            Are you new here?{' '}
                                <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    );
}