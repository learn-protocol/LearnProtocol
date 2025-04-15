import "./profile.scss";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="profile-container">
            <main>{children}</main>
        </div>
    );
}
