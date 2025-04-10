"use client";

import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

import { DDMMYYYYHHMM } from "@/lib/utils";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { UserActivities } from "@/actions/profile/UserActivities";

import "./activity.scss";

interface IActivity {
    type: string;
    date: Date;
    activity: React.ReactNode;
}

export default function UserActivity() {
    const { user: username }: { user: string } = useParams();

    const [more, setMore] = useState(false);

    const {
        data: datas,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["activities"],
        queryFn: fetchActivities,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

    async function fetchActivities({ pageParam }) {
        const res = await UserActivities(username!, pageParam + 1, 15);
        setMore(res.more);
        return { activities: res.activities, nextCursor: pageParam + 1 };
    }

    if (!username) return null;
    return (
        <div className="user-activity">
            {status === "error" && <p className="text-red-600 text-md">{error.message}</p>}
            {isFetching ? (
                <Loading size={32} />
            ) : (
                <>
                    {datas?.pages?.[0]?.activities?.length ? (
                        <div className="user-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th></th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas.pages.map((group, i: number) => (
                                        <Fragment key={i}>
                                            {group.activities.map((data: IActivity, j: number) => (
                                                <tr key={data.date.toString() + i + j}>
                                                    <td>
                                                        <b>{data.type}</b>
                                                    </td>
                                                    <td>{data.activity}</td>
                                                    <td className="date">{DDMMYYYYHHMM(data.date)}</td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                            <br />
                            {status === "success" && more && (
                                <Button
                                    variant="outline"
                                    className="load-more"
                                    onClick={() => fetchNextPage()}
                                    disabled={!hasNextPage || isFetchingNextPage}
                                >
                                    {isFetchingNextPage
                                        ? "Loading more..."
                                        : hasNextPage
                                          ? "Load More"
                                          : "No more activities"}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <p className="not-found">No activities found.</p>
                    )}
                </>
            )}
        </div>
    );
}
