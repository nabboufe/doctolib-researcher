import { Route, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({component: Component, hideToUser, hideToVisitor, url, ...rest }) => {
    return (
        <Route
            {... rest}
            render={ (props) =>
                (!!Cookie.get('loggedIn') && !hideToUser) ||
                (!Cookie.get('loggedIn') && !hideToVisitor) ?
                <Component {...props} {...rest} /> : <Redirect to={url} /> }
        />
)};

export default ProtectedRoute;
