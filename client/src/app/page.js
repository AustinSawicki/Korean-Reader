// Use the 'redirect' function from next/navigation
import { redirect } from 'next/navigation';

function Home() {
  redirect('/number-guesser');
  return;
}

export default Home;