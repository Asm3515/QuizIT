import { DotLottiePlayer } from '@dotlottie/react-player';
import signup_animation from '../assets/lottie/signup.lottie';
import { Link, Form, redirect } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';

export async function action({ request }) {
    const formData = await request.formData();
    if (formData.get('password') != formData.get('confirmpassword')) {
        alert("Passwords do not match");
        return false;
    }
    else {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            body: JSON.stringify({ 'name': formData.get('name'), 'email': formData.get('email'), 'password': formData.get('password') }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS,DELETE',
                'Access-Control-Allow-Credentials': 'true'
            },
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (response.status == 201) {
            return redirect(`user/${jsonResponse['id']}`);
        }
        else if(response.status==400){
            alert("Email already exists, try logging in");
        }
        else {
            alert("Unable to Register Please try again");
        }
    }
    return true;
}

export function SignUpPage() {
    return (
        <Fade triggerOnce={true}>
            <div className="h-screen flex items-center justify-center">
                <div className="grid grid-cols-2">
                    <DotLottiePlayer className='illustration max-half-screen-size margin-right-20' src={signup_animation} autoplay loop />
                    <div className="flex ml-20 max-half-screen-size flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Create a new account
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <Form className="space-y-6" action={action} method="POST">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            className="p-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
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
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="confirmpassword" className="block text-sm font-medium leading-6 text-gray-900">
                                            Confirm Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="confirmpassword"
                                            name="confirmpassword"
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
                                        Sign up
                                    </button>
                                </div>
                            </Form>

                            <p className="mt-10 text-center text-sm text-gray-500">
                                Already a member?{' '}
                                <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    );
}