import React from 'react';
import { Link} from "react-router-dom";

// Homepage
const Home = () => (

    <div>
        <div className="jumbotron centered intro hero-image">
            <h1>Women&apos;s Coding Community</h1>
            <p className="lead">Helping women to aspire in coding by supporting each other through shared knowledge, advice and ideas.</p>
            <div className="memberButton">
            <Link to="/question/all" className="button">BROWSE OUR COMMUNITY</Link>
            </div>
        </div>


        <div className="container">
            <div className="row">


                <div className="card col-md-4" style={{textAlign: "center", border: "1px solid gray"}}>
                    <div>
                        <h4 style={{marginTop: "20px"}}>Who We Are</h4>
                        <p>We have a great community of female coding members who are here to help.</p>
                        <br />
                        <Link to="/about" className="button">FIND OUT MORE</Link>
                    </div>
                </div>

                <div className="card col-md-4" style={{textAlign: "center", border: "1px solid gray"}}>
                    <div>
                        <h4 style={{marginTop: "20px"}} >Our community</h4>
                        <p >Our community pages are full of useful posts about coding and more.</p>
                        <br />
                        <Link to="/question/all" className="button">VISIT COMMUNITY</Link>
                    </div>
                </div>

                <div className=" card col-md-4" style={{textAlign: "center", border: "1px solid gray"}}>
                    <div>
                        <h4 style={{marginTop: "20px"}}>Our Blog</h4>
                        <p >Read our blog to find out more about the latest coding hints and tips. </p>
                        <br />
                        <Link to="/blog/all" className="button">READ OUR BLOG</Link>
                    </div>
                </div>


            </div>
        </div>



    </div>

)

export default Home;