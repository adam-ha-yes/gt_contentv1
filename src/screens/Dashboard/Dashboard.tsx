import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { IdeaAssistant } from "../../components/IdeaAssistant";

export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);
  const [isScheduleEditorOpen, setIsScheduleEditorOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['monday', 'wednesday', 'friday']);
  const [selectedTimes, setSelectedTimes] = useState(['11:00', '14:00']);
  const [postUrl, setPostUrl] = useState("");
  const [activeTab, setActiveTab] = useState("ideas");
  const [selectedVoice, setSelectedVoice] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (location.state?.showSuccess) {
      setPostUrl(location.state.postUrl);
      setShowSuccessModal(true);
    }
    if (location.state?.showDraftSuccess) {
      setShowDraftSuccess(true);
      setActiveTab('drafts');
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setShowDraftSuccess(false);
      }, 3000);
    }
  }, [location]);

  useEffect(() => {
    const idx = tabItems.findIndex(tab => tab.name.toLowerCase() === activeTab);
    const tabEl = tabRefs.current[idx];
    if (tabEl) {
      setIndicatorStyle({
        left: tabEl.offsetLeft,
        width: tabEl.offsetWidth
      });
    }
  }, [activeTab]);

  // Brand voices data
  const brandVoices = [
    { id: 1, name: "Professional" },
    { id: 2, name: "Casual" },
    { id: 3, name: "Friendly" },
    { id: 4, name: "Humorous" },
  ];

  // Navigation menu items data
  const navItems = [
    { name: "Create Content", active: true },
    { name: "Trending", active: false },
    { name: "Ask AI", active: false },
  ];

  // Tab items data
  const tabItems = [
    { name: "Ideas", active: true },
    { name: "Queue", active: false },
    { name: "Drafts", active: false },
    { name: "Posted", active: false },
  ];

  // Tweet data
  const tweets = [
    {
      id: 2,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "THIS APP IS AWESOME!\n\nFinch makes $2M/month, making self-care feel like raising a pet.\n\nForget boring habit trackers. They merged Tamagotchi nostalgia with mental wellness.\n\nResult? Insane engagement & revenue.\n\nHere's the breakdown",
      verified: true,
      hasVideo: true,
      showMore: true,
      stats: { replies: 6, reposts: 23, likes: 338, views: "46K" },
    },
    {
      id: 3,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "Moving back to NY next week, after 5 weeks in SF.\n\nI will write full thoughts on SF soon.\n\nBut I'm so excited to be back. It's in my blood. I've missed the city more and more every day.\n\nAnd it's the right place to build Aura.",
      verified: true,
      stats: { replies: 6, reposts: 23, likes: 338, views: "46K" },
      hasOverlay: true,
      schedule: true,
    },
    {
      id: 4,
      author: "Adam",
      username: "@adam_ha_yes",
      date: "Apr 24",
      content:
        "Moving back to NY next week, after 5 weeks in SF.\n\nI will write full thoughts on SF soon.\n\nBut I'm so excited to be back. It's in my blood. I've missed the city more and more every day.\n\nAnd it's the right place to build Aura.",
      verified: true,
      stats: { replies: 6, reposts: 23, likes: 338, views: "46K" },
    },
  ];

  // Mock data for drafts
  const drafts = [
    {
      id: 1,
      content: "Here's a draft about product launches. Remember to add stats and a call to action.",
      lastEdited: 'Apr 25, 2024',
    },
    {
      id: 2,
      content: "Draft: 5 ways to grow your Twitter audience in 2024...",
      lastEdited: 'Apr 24, 2024',
    },
    {
      id: 3,
      content: "Unfinished thread on AI tools for creators. Add more examples!",
      lastEdited: 'Apr 22, 2024',
    },
  ];

  // Mock data for scheduled posts (queue)
  const scheduledPosts = [
    {
      id: 1,
      content: "Scheduled post about product launch coming up soon!",
      scheduledFor: 'Apr 28, 2024, 10:00 AM',
      stats: { replies: 2, reposts: 5, likes: 20, views: '1.2K' },
    },
    {
      id: 2,
      content: "Don't miss our new feature announcement!",
      scheduledFor: 'Apr 29, 2024, 2:30 PM',
      stats: { replies: 1, reposts: 3, likes: 12, views: '800' },
    },
    {
      id: 3,
      content: "Weekly tips thread scheduled for next Monday.",
      scheduledFor: 'May 1, 2024, 9:00 AM',
      stats: { replies: 0, reposts: 0, likes: 0, views: '0' },
    },
  ];

  const handlePostClick = (id: number) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="bg-background flex flex-row justify-center w-full">
      <div className="bg-background overflow-hidden w-full max-w-[1602px] relative min-h-screen">
        {/* Navigation */}
        <div className="w-[240px] fixed left-0 top-0 h-full border-r border-[#2e2f33] bg-black z-20">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <img src="/gtlogo.svg" alt="Logo" className="h-8" />
            </div>
            <nav className="flex-1 px-3">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={`flex items-center px-4 py-2.5 my-1 text-sm rounded-lg transition-colors ${
                    item.active
                      ? "text-[#4ade80] bg-[#4ade80]/10"
                      : "text-[#e4e4e7] hover:bg-[#2e2f33]"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="p-4 m-3 border border-[#2e2f33] rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-[#e4e4e7]">Adam Hayes</div>
                  <div className="text-xs text-[#71717a]">@Adam_Ha_Yes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-[240px] pr-[400px] min-h-screen">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-background border-b border-border w-full justify-start rounded-none p-0 h-auto">
                  {tabItems.map((tab, index) => (
                    <TabsTrigger
                      key={tab.name}
                      value={tab.name.toLowerCase()}
                      ref={(el) => (tabRefs.current[index] = el)}
                      className={`px-6 py-3 text-base font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary ${
                        activeTab === tab.name.toLowerCase()
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
                <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                >
                  Create New
                </Button>
                  </div>

            {/* Content based on active tab */}
            {activeTab === "ideas" && (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <Card
                    key={tweet.id}
                    className="group relative bg-card border-border hover:bg-muted/60 hover:border-primary cursor-pointer transition-all"
                    onClick={() => handlePostClick(tweet.id)}
                  >
                    <Button
                      variant="ghost"
                      className="absolute right-4 top-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Edit
                    </Button>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/avatar.png" />
                          <AvatarFallback>AH</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{tweet.author}</span>
                            <span className="text-muted-foreground">{tweet.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{tweet.date}</span>
                          </div>
                          <p className="mt-1 text-foreground whitespace-pre-line">{tweet.content}</p>
                          {tweet.hasVideo && (
                            <div className="mt-3 aspect-video bg-accent rounded-xl"></div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                  </div>
                )}

            {/* Drafts Tab */}
            {activeTab === "drafts" && (
              <div className="space-y-4">
                {drafts.map((draft) => (
                  <Card
                    key={draft.id}
                    className="group relative bg-card border-border hover:bg-muted/60 hover:border-primary cursor-pointer transition-all"
                  >
                    <div className="absolute right-4 top-2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        className="rounded-lg w-8 h-8 p-0 hover:bg-red-600/10 hover:text-red-500 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-lg w-8 h-8 p-0 hover:bg-white hover:text-black text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-lg w-[70px] h-8 p-0 hover:bg-white hover:text-black text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        + Queue
                      </Button>
                    </div>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/avatar.png" />
                          <AvatarFallback>AH</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">Draft</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">Last edited {draft.lastEdited}</span>
                            </div>
                          <p className="mt-1 text-foreground whitespace-pre-line">{draft.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            )}

            {/* Queue Tab */}
            {activeTab === "queue" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-foreground">Queue</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsScheduleEditorOpen(true)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Edit Posting Schedule
                  </Button>
                </div>

                <div className="space-y-8">
                  {/* Today's Schedule */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-medium">Today</h3>
                      <span className="text-muted-foreground">April 29</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">11:10 AM</div>
                        <div className="flex-1">
                          {scheduledPosts.find(post => post.scheduledFor === 'Apr 29, 2024, 10:00 AM') ? (
                            <Card className="bg-muted border-border hover:bg-muted/60 cursor-pointer transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback>AH</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground">Scheduled</span>
                                      <span className="text-muted-foreground">·</span>
                                      <span className="text-primary">11:10 AM</span>
                                    </div>
                                    <p className="mt-1 text-foreground whitespace-pre-line">Don't miss our new feature announcement!</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              + New
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">2:54 PM</div>
                        <div className="flex-1">
                          {scheduledPosts.find(post => post.scheduledFor === 'Apr 29, 2024, 2:30 PM') ? (
                            <Card className="bg-muted border-border hover:bg-muted/60 cursor-pointer transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback>AH</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground">Scheduled</span>
                                      <span className="text-muted-foreground">·</span>
                                      <span className="text-primary">2:54 PM</span>
                                    </div>
                                    <p className="mt-1 text-foreground whitespace-pre-line">Scheduled post about product launch coming up soon!</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              + New
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tomorrow's Schedule */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-medium">Tomorrow</h3>
                      <span className="text-muted-foreground">April 30</span>
                            </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">11:10 AM</div>
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            + New
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">2:54 PM</div>
                        <div className="flex-1">
                        <Button
                          variant="outline"
                            className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            + New
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thursday's Schedule */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-medium">Thursday</h3>
                      <span className="text-muted-foreground">May 1</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">11:10 AM</div>
                        <div className="flex-1">
                          {scheduledPosts.find(post => post.scheduledFor === 'May 1, 2024, 9:00 AM') ? (
                            <Card className="bg-muted border-border hover:bg-muted/60 cursor-pointer transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback>AH</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground">Scheduled</span>
                                      <span className="text-muted-foreground">·</span>
                                      <span className="text-primary">11:10 AM</span>
                                    </div>
                                    <p className="mt-1 text-foreground whitespace-pre-line">Weekly tips thread scheduled for next Monday.</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              + New
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Friday's Schedule */}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-medium">Friday</h3>
                      <span className="text-muted-foreground">May 2</span>
              </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">11:10 AM</div>
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            + New
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-muted-foreground">2:54 PM</div>
                          <div className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            + New
                          </Button>
                        </div>
                            </div>
                            </div>
                          </div>
                        </div>
              </div>
            )}

            {/* Posted Tab */}
            {activeTab === "posted" && (
              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <Card 
                    key={tweet.id} 
                    className="bg-muted border-border hover:bg-muted/60 cursor-pointer transition-colors"
                    onClick={() => handlePostClick(tweet.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src="/avatar.png" />
                          <AvatarFallback>AH</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{tweet.author}</span>
                            <span className="text-muted-foreground">{tweet.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{tweet.date}</span>
                          </div>
                          <p className="mt-1 text-foreground whitespace-pre-line">{tweet.content}</p>
                          {tweet.hasVideo && (
                            <div className="mt-3 aspect-video bg-accent rounded-xl"></div>
                          )}
                          <div className="flex items-center gap-6 mt-3">
                            <button className="text-muted-foreground hover:text-primary flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              <span className="text-sm text-[#666666]">{tweet.stats.replies}</span>
                            </button>
                            <button className="text-muted-foreground hover:text-primary flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 2.1l4 4-4 4" />
                                <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
                                <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
                              </svg>
                              <span className="text-sm text-[#666666]">{tweet.stats.reposts}</span>
                            </button>
                            <button className="text-muted-foreground hover:text-primary flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                              </svg>
                              <span className="text-sm text-[#666666]">{tweet.stats.likes}</span>
                            </button>
                            <button className="text-muted-foreground hover:text-primary flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                              </svg>
                              <span className="text-sm text-[#666666]">{tweet.stats.views}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Success notification for drafts */}
            {showDraftSuccess && (
              <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                Draft saved successfully!
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - AI Assistant */}
        <IdeaAssistant />

        {/* Create New Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="!bg-black border-[#2e2f33] sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#e4e4e7]">Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-[#e4e4e7] mb-2 block">Brand Voice</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-full bg-[#1a1b1e] border-[#2e2f33] text-[#e4e4e7]">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1b1e] border-[#2e2f33]">
                      {brandVoices.map((voice) => (
                        <SelectItem 
                          key={voice.id} 
                          value={voice.name.toLowerCase()}
                          className="text-[#e4e4e7] hover:bg-[#2e2f33] cursor-pointer"
                        >
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[#e4e4e7] mb-2 block">Content</Label>
                  <textarea
                    className="w-full min-h-[200px] p-3 bg-[#1a1b1e] border border-[#2e2f33] rounded-md text-[#e4e4e7] resize-none focus:outline-none focus:ring-2 focus:ring-[#4f9556] placeholder-[#71717a]"
                    placeholder="What's on your mind?"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="border-[#2e2f33] text-[#e4e4e7] hover:bg-[#2e2f33] hover:text-white bg-[#1a1b1e]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                    Add Media
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#2e2f33] text-[#e4e4e7] hover:bg-[#2e2f33] hover:text-white bg-[#1a1b1e]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M12 8v8"/>
                      <path d="m8 12 4 4 4-4"/>
                    </svg>
                    Add Poll
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#2e2f33] text-[#e4e4e7] hover:bg-[#2e2f33] hover:text-white bg-[#1a1b1e]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Attach File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                className="bg-[#4ade80] text-[#0c0c0c] hover:bg-[#4ade80]/90 px-8 py-2 rounded-lg font-medium"
                onClick={() => setIsDialogOpen(false)}
              >
                Generate
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Editor Dialog */}
        <Dialog open={isScheduleEditorOpen} onOpenChange={setIsScheduleEditorOpen}>
          <DialogContent className="bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">Edit Posting Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label className="text-foreground">Posting Days</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Button
                      key={day}
                      variant={selectedDays.includes(day.toLowerCase()) ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => {
                        const dayLower = day.toLowerCase();
                        setSelectedDays(prev =>
                          prev.includes(dayLower)
                            ? prev.filter(d => d !== dayLower)
                            : [...prev, dayLower]
                        );
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-foreground">Posting Times</Label>
                <div className="space-y-2 mt-2">
                  {selectedTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...selectedTimes];
                          newTimes[index] = e.target.value;
                          setSelectedTimes(newTimes);
                        }}
                        className="bg-background border border-border text-foreground rounded-md p-2"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive-foreground"
                        onClick={() => setSelectedTimes(prev => prev.filter((_, i) => i !== index))}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setSelectedTimes(prev => [...prev, '12:00'])}
                  >
                    + Add Time Slot
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsScheduleEditorOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsScheduleEditorOpen(false)}>
                Save Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};