import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Home() {

    return (
        <Layout>                  
            <br />
            <br />
            <Link to="/create-patreon"><button className='primary'>Create a profile</button></Link>
        </Layout>
    );
}