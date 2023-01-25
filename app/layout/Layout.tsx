import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children, session }: any) => {
	return (
		<div className="flex flex-auto">
			<Sidebar session={session} />
			<div className="grow bg-gray-100">
				<Navbar session={session} />
				<div className="m-5">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
