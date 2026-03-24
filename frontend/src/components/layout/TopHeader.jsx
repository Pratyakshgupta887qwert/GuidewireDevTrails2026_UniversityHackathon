import { worker } from "../../data/mockData";

export default function TopHeader() {
  return (
    <header className="top-header">
      <div className="top-header__left">
        <div className="avatar-pill">RR</div>
        <div>
          <p className="top-header__hello">Hi! {worker.name}</p>
          <p className="top-header__sub">{worker.greeting}</p>
        </div>
      </div>
      <button className="icon-pill" aria-label="Support">
        ?
      </button>
    </header>
  );
}
