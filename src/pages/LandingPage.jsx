import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <>
            <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://d1ymz67w5raq8g.cloudfront.net/Pictures/480xany/6/5/5/509655_shutterstock_1506580442_769367.jpg)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">QuizIT</h1>
                        <p className="mb-5">Learn, Test and Quiz It</p>
                        <Link to="/signup" className="btn btn-primary rounded-md mr-5">Signup</Link>
                        <Link to="/login" className="btn btn-accent rounded-md">Login</Link>
                    </div>
                </div>
            </div>


            <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
                <aside>
                    <p>QuizIT AI © 2024 - Made With ❤️ using Groq, Llama3 and Langchain</p>
                </aside>
            </footer>

        </>
    )
}