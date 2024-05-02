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
        const response = await fetch('', {
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
            return redirect(`verify/${jsonResponse['id']}`);
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
            <section className="authentication-container">
                <div className="grid w-full grid-cols-2">
                    <div>
                        <DotLottiePlayer className='illustration' src={signup_animation} autoplay loop />
                    </div>

                    <div>
                        {/* <Form action={action} method='post'>
                                <h1>Sign Up</h1>
                                <input type="text" id="name" name="name" placeholder='Name' required />
                                <input type="email" id="email" name="email" placeholder='Email' required />
                                <input type="password" id="password" name="password" placeholder='Password' minLength='6' required />
                                <input type="password" id="confirmpassword" name="confirmpassword" placeholder='Confirm Password' minLength='6' required />
                                <button type="submit">Sign Up</button>
                                <p>Already have an account? <Link to='/login'>Click here to login</Link></p>
                            </Form> */}
                        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <img
                                    className="mx-auto h-10 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    alt="Metamusic"
                                />
                                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    Create a new account
                                </h2>
                            </div>

                            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                <form className="space-y-6" action="#" method="POST">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                autoComplete="name"
                                                required
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                </form>

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
            </section>
        </Fade>
    );
}