import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Home() {

    return (
        <Layout>                  
            <br />
            <br />
            <Link to="/profile/123"><button className='primary'>link to profile</button></Link>
        </Layout>
    );
}