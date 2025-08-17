import Layout from "../components/layout";

export default function FrontPage() {
  return (
    <Layout authed={false}>
      <h1>
        <a href="/clocks">Clocks</a>
      </h1>
      <p>This is the front page of the ClockCamera application.</p>
    </Layout>
  );
}
