"use client";

import Link from "next/link";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { GetUserPosts } from "@/actions/profile/GetUserPosts";
import { GetUserAnswers } from "@/actions/profile/GetUserAnswers";
import { UserEarningsStats } from "@/actions/profile/UserEarningsStats";

import "./statistics.scss";

export default function UserStatistics() {
    const { user: username }: { user: string } = useParams();

    const [morePosts, setMorePosts] = useState(false);
    const [moreAnswers, setMoreAnswers] = useState(false);
    const [userEarningsStats, setUserEarningsStats] = useState<any>(null);

    const {
        data: answerData,
        error: answerError,
        fetchNextPage: fetchNextPageAnswer,
        hasNextPage: hasNextPageAnswer,
        isFetching: isFetchingAnswer,
        isFetchingNextPage: isFetchingNextPageAnswer,
        status: statusAnswer,
    } = useInfiniteQuery({
        queryKey: ["answers"],
        queryFn: async ({ pageParam }) => {
            const res = await GetUserAnswers(username!, pageParam + 1, 5);
            setMoreAnswers(res.more);
            return { answers: res.answers, nextCursor: pageParam + 1 };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

    const {
        data: postData,
        error: postError,
        fetchNextPage: fetchNextPagePost,
        hasNextPage: hasNextPagePost,
        isFetching: isFetchingPost,
        isFetchingNextPage: isFetchingNextPagePost,
        status: statusPost,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: async ({ pageParam }) => {
            const res = await GetUserPosts(username!, pageParam + 1, 5);
            setMorePosts(res.more);
            return { posts: res.posts, nextCursor: pageParam + 1 };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

    useEffect(() => {
        if (!username) return;

        async function fetchUserStats() {
            const [earningStats] = await Promise.all([UserEarningsStats(username)]);
            setUserEarningsStats(earningStats);
        }

        fetchUserStats();
    }, [username]);

    if (!username) return null;
    return (
        <div className="user-statistics">
            <div className="grid grid-cols-4 gap-4">
                <UserAnswers
                    datas={answerData}
                    isFetching={isFetchingAnswer}
                    error={answerError}
                    more={moreAnswers}
                    status={statusAnswer}
                    fetchNextPage={fetchNextPageAnswer}
                    hasNextPage={hasNextPageAnswer}
                    isFetchingNextPage={isFetchingNextPageAnswer}
                />
                <UserPosts
                    datas={postData}
                    isFetching={isFetchingPost}
                    error={postError}
                    more={morePosts}
                    status={statusPost}
                    fetchNextPage={fetchNextPagePost}
                    hasNextPage={hasNextPagePost}
                    isFetchingNextPage={isFetchingNextPagePost}
                />
                <div className="col-span-2 max-2xl:col-span-4">
                    <EarningChart data={userEarningsStats} />
                </div>
            </div>
        </div>
    );
}

function EarningChart({ data }: { data: any }) {
    return (
        <div className="earning-chart">
            <h3>Earnings</h3>
            <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={data} margin={{ left: -15, bottom: -15, right: -20 }}>
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2f4ce7" stopOpacity={1} />
                            <stop offset="100%" stopColor="#677df8" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="day" fontSize={10} stroke="#4c4c4c" tickLine={false} />
                    <YAxis
                        dataKey="earning"
                        fontSize={14}
                        stroke="#4c4c4c"
                        fontWeight={600}
                        fontFamily="Poppins"
                        tickLine={false}
                        orientation="right"
                    />
                    <Area
                        type="linear"
                        dataKey="earning"
                        stroke="#2f4ce7"
                        strokeWidth={1}
                        fill="url(#areaGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function UserAnswers({
    datas,
    isFetching,
    error,
    more,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: {
    datas: any;
    isFetching: boolean;
    error: any;
    more: boolean;
    status: string;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}) {
    return (
        <div className="user-table max-2xl:col-span-2">
            <h3>Answers</h3>
            {status === "error" && <p className="text-red-600 text-md">{error.message}</p>}
            {isFetching ? (
                <Loading size={32} />
            ) : (
                <>
                    {datas?.pages?.[0]?.answers?.length ? (
                        <>
                            <table>
                                <tbody>
                                    {datas.pages.map((group: any, i: number) => (
                                        <Fragment key={i}>
                                            {group.answers.map((data: any, j: number) => (
                                                <tr key={data.createdAt.toString() + i + j}>
                                                    <td>
                                                        <div
                                                            className={
                                                                "votes " +
                                                                (data.votes > 0
                                                                    ? "positive"
                                                                    : data.votes < 0
                                                                      ? "negative"
                                                                      : "")
                                                            }
                                                        >
                                                            {data.votes}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            href={`/post/${data.postSlug}-${data.postId}#answer-${data.id}`}
                                                            className="title"
                                                        >
                                                            {data.postTitle}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
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
                                          : "No more answers"}
                                </Button>
                            )}
                        </>
                    ) : (
                        <p className="not-found">No answers found.</p>
                    )}
                </>
            )}
        </div>
    );
}

function UserPosts({
    datas,
    isFetching,
    error,
    more,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: {
    datas: any;
    isFetching: boolean;
    error: any;
    more: boolean;
    status: string;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}) {
    return (
        <div className="user-table max-2xl:col-span-2">
            <h3>Questions</h3>
            {status === "error" && <p className="text-red-600 text-md">{error.message}</p>}
            {isFetching ? (
                <Loading size={32} />
            ) : (
                <>
                    {datas?.pages?.[0]?.posts?.length ? (
                        <>
                            <div className="table-container">
                                <table>
                                    <tbody>
                                        {datas.pages.map((group: any, i: number) => (
                                            <Fragment key={i}>
                                                {group.posts.map((data: any, j: number) => (
                                                    <tr key={data.createdAt.toString() + i + j}>
                                                        <td>
                                                            <Link
                                                                href={`/post/${data.slug}-${data.id}`}
                                                                className="title"
                                                            >
                                                                {data.title}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                          : "No more posts"}
                                </Button>
                            )}
                        </>
                    ) : (
                        <p className="not-found">No questions found.</p>
                    )}
                </>
            )}
        </div>
    );
}
