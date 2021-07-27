import Alert from "components/alert";
import Footer from "components/footer";
import Header from "components/header";
import Meta from "components/meta";

export default function Layout({ preview, children }) {
  return (
    <>
      <Meta />
      <Header />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
