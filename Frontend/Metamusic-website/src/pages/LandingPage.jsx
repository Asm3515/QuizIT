import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <>
            <section className="relative">

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
                    <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
                                <stop stopColor="#FFF" offset="0%" />
                                <stop stopColor="#EAEAEA" offset="77.402%" />
                                <stop stopColor="#DFDFDF" offset="100%" />
                            </linearGradient>
                        </defs>
                        <g fill="url(#illustration-01)" fillRule="evenodd">
                            <circle cx="1232" cy="128" r="128" />
                            <circle cx="155" cy="443" r="64" />
                        </g>
                    </svg>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Hero content */}
                    <div className="pt-32 pb-12 md:pt-40 md:pb-20">

                        {/* Section header */}
                        <div className="text-center pb-12 md:pb-16">
                            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">MetaMusic <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"></span></h1>
                            <div className="max-w-3xl mx-auto">
                                <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">Listen to Best Possible Music!</p>
                                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                                    <div>
                                        <Link to="/signup" className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0" href="#0">Signup</Link>
                                    </div>
                                    <div>
                                        <Link to="/login" className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4" href="#0">Login</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
            <footer className="footer-copy">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                        </div>
                    </div>
                </div>
            </footer>


            <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://google.com/" className="hover:underline">MetaMusic™</a>. All Rights Reserved. Website Designed with ❤️ by Aditya, Sumedh and Ajinkya
                    </span>
                </div>
            </footer>

        </>
    )
}