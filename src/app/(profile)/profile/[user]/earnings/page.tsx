import Verify from "@/components/Profile/Verify";
import { GetSteps } from "@/actions/profile/GetSteps";
import BalanceContainer from "@/components/Profile/Balance";

import "./earnings.scss";

export default async function Earnings() {
    const completedSteps = (await GetSteps()) || {
        "step-1": false,
        "step-2": false,
    };

    const values = Object.values(completedSteps);
    const completed = values.filter(s => s).length;
    const progress = (completed / values.length) * 100;

    return (
        <div className="user-earnings">
            <div className="steps">
                <h2 className="text-2xl">Withdraw</h2>
                <p>
                    Before you withdraw $LP tokens that you earned, you need to complete a couple of tasks to
                    prove your hard-work.
                </p>
                <ol className="mt-6">
                    <li className={completedSteps["step-1"] ? "opacity-50 cursor-not-allowed" : ""}>
                        <h3>Verify Account</h3>
                        <p>
                            In order to claim your $LP tokens you must verify your <span>Learn Protocol</span>{" "}
                            account. For that, you need to transfer 1 EDU coin to treasury wallet.
                        </p>
                        <div className="verification">
                            <Verify done={completedSteps["step-1"]} />
                        </div>
                    </li>
                    <li>
                        <h3>
                            Get at least <span>50 upvotes</span>
                        </h3>
                        <p>
                            Answer some questions and gain upvotes from other users. You need minimum 50
                            upvotes to activate $LP withdraws.
                        </p>
                    </li>
                </ol>
                <div className="progress-container">
                    <p>
                        You have completed <span>{completed}</span> out of <span>{values.length}</span> steps
                    </p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-center">
                <BalanceContainer />
            </div>
        </div>
    );
}
