import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <>
            <div className="hero min-h-screen" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/D%C3%BClmen%2C_D%C3%BClmener_Sommer%2C_Open-Air-Konzert%2C_%22Bounce%22_--_2018_--_0051.jpg/1200px-D%C3%BClmen%2C_D%C3%BClmener_Sommer%2C_Open-Air-Konzert%2C_%22Bounce%22_--_2018_--_0051.jpg)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">MetaMusic</h1>
                        <p className="mb-5">Listen to the best Possible Music Available Out There!</p>
                        <Link to="/signup" className="btn btn-primary rounded-md mr-5">Signup</Link>
                        <Link to="/login" className="btn btn-accent rounded-md">Login</Link>
                    </div>
                </div>
            </div>


            <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
                <aside>
                    <p>MetaMusic © 2024 - Made With ❤️ by Aditya, Sumedh and Ajinkya</p>
                </aside>
            </footer>

        </>
    )
}