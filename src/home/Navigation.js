import React from "react";
import { Link, withRouter } from "react-router-dom";
import { logout } from '../member/memberAccount';
import { isLoggedin } from '../member/memberAccount';
import LogoImage from '../images/logo.png';


const Navigation = ({ history }) => (
    <div className="menuContainer" style={{ position: "fixed", top: "0px", left: "0px", width: "100%", zIndex: "100" }}>

        <ul className="nav nav-tabs bg-dark" >

            <li className="nav-item" >
                <div class="imgcontainer" style={{ margin: "0px 50px 0px 0px" }}>
                    <img style={{ height: "66px" }} src={LogoImage} className="logoImage" alt="WCC" />
                </div>
            </li>

            <li className="nav-item">
                <Link className="nav-link"
                    to="/">Home</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"
                    to="/members">Members</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"
                    to="/question/all">COMMUNITY</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"
                    to="/blog/all">BLOG</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link"
                    to="/event/all">EVENTS</Link>
            </li>

            {!isLoggedin() && (
                <>
                    <li className="nav-item">

                        <Link className="nav-link"
                            to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link"
                            to="/register">Become A Member</Link>
                    </li>
                </>
            )}

            {isLoggedin() && (
                <>
                    <li className="nav-item">

                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={{ cursor: 'pointer', color: '#fff' }}
                            onClick={() => logout(() => history.push('/question/all'))}>
                            Log Out
                </span>
                    </li>

                    <li className="nav-item">

                        <Link to={`/member/${isLoggedin().member._id}`}
                            className="nav-link"
                        >
                            {`MY ACCOUNT`}
                        </Link>

                    </li>
                </>
            )}
        </ul>
    </div>
);

export default withRouter(Navigation);

