import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './home/Home';
import Navigation from './home/Navigation';
import Register from './member/Register';
import Login from './member/Login';
import ReadMember from './member/ReadMember';
import ReadAllMembers from './member/ReadAllMembers';
import UpdateMember from './member/UpdateMember';
import CreateQuestion from "./forum/CreateQuestion"
import ReadQuestion from "./forum/ReadQuestion";
import UpdateQuestion from "./forum/UpdateQuestion";
import ReadAllQuestions from './forum/ReadAllQuestions';
import About from './home/About';
import SearchQuestion from './forum/SearchQuestion';
import CreateBlog from './blog/CreateBlog';
import ReadAllBlogs from './blog/ReadAllBlogs';
import ReadBlog from './blog/ReadBlog';
import UpdateBlog from './blog/UpdateBlog';
import CreateEvent from "./event/CreateEvent"
import ReadEvent from "./event/ReadEvent";
import UpdateEvent from "./event/UpdateEvent";
import ReadAllEvents from './event/ReadAllEvents';


const Router = () => (
    <div>
        <Navigation />
        <Switch>
            <Route exact path="/" component={Home} />

            <Route exact path="/question/new" component={CreateQuestion} />
            <Route exact path="/question/search" component={SearchQuestion} />
            <Route exact path="/question/all" component={ReadAllQuestions} />
            <Route exact path="/question/:questionId" component={ReadQuestion} />
            <Route exact path="/question/update/:questionId" component={UpdateQuestion} />

            <Route exact path="/blog/new" component={CreateBlog} />
            <Route exact path="/blog/all" component={ReadAllBlogs} />
            <Route exact path="/blog/:blogId" component={ReadBlog} />
            <Route exact path="/blog/update/:blogId" component={UpdateBlog} />

            <Route exact path="/event/new" component={CreateEvent} />
            <Route exact path="/event/all" component={ReadAllEvents} />
            <Route exact path="/event/:eventId" component={ReadEvent} />
            <Route exact path="/event/update/:eventId" component={UpdateEvent} />

            <Route exact path="/members" component={ReadAllMembers} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/member/update/:memberId" component={UpdateMember} />
            <Route exact path="/member/:memberId" component={ReadMember} />
            <Route exact path="/about" component={About} />
            
        </Switch>
    </div>
)

export default Router;