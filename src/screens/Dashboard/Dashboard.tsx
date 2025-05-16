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
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';

interface BrandVoice {
  id: number;
  name: string;
  instructions: string;
  assets: string[];
  people: { name: string; username: string }[];
  files: File[];
}

// Mock accounts
const mockAccounts = [
  {
    name: 'Adam Hayes',
    username: '@Adam_Ha_Yes',
    avatar: '/avatar.png',
    id: 1,
  },
  {
    name: 'Andros',
    username: '@0xAndros',
    avatar: 'https://avatars.githubusercontent.com/u/000000?v=4',
    id: 2,
  },
];

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
  const [activeAccount, setActiveAccount] = useState(mockAccounts[0]);
  const [selectedVoiceModal, setSelectedVoiceModal] = useState<null | { id: number, name: string }>(null);
  const [voiceInstructions, setVoiceInstructions] = useState("");
  const [voiceAssets, setVoiceAssets] = useState<string[]>([]);
  const [assetInput, setAssetInput] = useState("");
  const preselectedPeople = [
    { name: "Elon Musk", username: "@elonmusk" },
    { name: "Sahil Bloom", username: "@SahilBloom" },
    { name: "Lyn Alden", username: "@LynAldenContact" },
    { name: "Alex Lieberman", username: "@businessbarista" },
    { name: "Lenny Rachitsky", username: "@lennysan" },
    { name: "Katelyn Bourgoin", username: "@KateBour" },
    { name: "Julian Shapiro", username: "@Julian" },
  ];
  const [voicePeople, setVoicePeople] = useState<{ name: string; username: string }[]>([]);
  const [addPersonInput, setAddPersonInput] = useState("");
  const [showCreateVoiceModal, setShowCreateVoiceModal] = useState(false);
  const [newVoiceName, setNewVoiceName] = useState("");
  const [newVoiceInstructions, setNewVoiceInstructions] = useState("");
  const [newVoiceAssets, setNewVoiceAssets] = useState<string[]>([]);
  const [newAssetInput, setNewAssetInput] = useState("");
  const [newVoicePeople, setNewVoicePeople] = useState<{ name: string; username: string }[]>([]);
  const [newAddPersonInput, setNewAddPersonInput] = useState("");
  const [voiceFiles, setVoiceFiles] = useState<File[]>([]);
  const [newVoiceFiles, setNewVoiceFiles] = useState<File[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([
    { id: 1, name: "Professional", instructions: "Use formal language. Avoid slang.", assets: ["https://hbr.org/article/professional-writing"], people: [{ name: "Lyn Alden", username: "@LynAldenContact" }], files: [] },
    { id: 2, name: "Casual", instructions: "Keep it light and conversational.", assets: ["https://medium.com/casual-style-guide"], people: [{ name: "Sahil Bloom", username: "@SahilBloom" }], files: [] },
    { id: 3, name: "Friendly", instructions: "Be supportive and positive.", assets: ["https://friendlycopy.com/guide"], people: [{ name: "Katelyn Bourgoin", username: "@KateBour" }], files: [] },
    { id: 4, name: "Humorous", instructions: "Add wit and playful jokes.", assets: ["https://copyhackers.com/humor"], people: [{ name: "Julian Shapiro", username: "@Julian" }], files: [] },
  ]);

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

  // Navigation menu items data
  const navItems = [
    { name: "Create Content", active: true },
    { name: "Trending", active: false },
    { name: "Ask AI", active: false },
    { name: "Brand Voice", active: false },
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
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className={`w-full text-left flex items-center px-4 py-2.5 my-1 text-sm rounded-lg transition-colors ${
                    activeTab === item.name.toLowerCase()
                      ? "text-[#4ade80] bg-[#4ade80]/10"
                      : "text-[#e4e4e7] hover:bg-[#2e2f33]"
                  }`}
                  type="button"
                >
                  {item.name}
                </button>
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
            {/* Top Tabs and Create New button */}
            {activeTab !== "brand voice" && (
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
                <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                  Create New
                </Button>
              </div>
            )}

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

            {/* Brand Voice Tab */}
            {activeTab === "brand voice" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-[#4ade80]">Brand Voice</div>
                  <Button className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold px-6 py-2 rounded-lg" onClick={() => setShowCreateVoiceModal(true)}>
                    + Create New Voice
                  </Button>
                </div>
                <div className="flex flex-col gap-4 mt-6">
                  {brandVoices.map((voice) => (
                    <button
                      key={voice.id}
                      className="bg-[#18181b] border border-[#2e2f33] rounded-lg p-6 flex flex-col items-start hover:border-[#4ade80] transition-colors w-full"
                      onClick={() => {
                        setSelectedVoiceModal(voice);
                        setVoiceInstructions(voice.instructions || "");
                        setVoiceAssets(voice.assets || []);
                        setVoicePeople(voice.people || []);
                        setVoiceFiles(voice.files || []);
                      }}
                    >
                      <div className="text-lg font-semibold text-[#e4e4e7] mb-1">{voice.name}</div>
                      {voice.instructions && (
                        <div className="text-[#e4e4e7] text-base whitespace-pre-line mt-2">{voice.instructions}</div>
                      )}
                    </button>
                  ))}
                </div>
                {/* Create New Voice Modal */}
                <Dialog open={showCreateVoiceModal} onOpenChange={setShowCreateVoiceModal}>
                  <DialogContent className="bg-[#18181b] border-[#4ade80] max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-[#4ade80]">Create New Voice</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Voice Name</label>
                      <input
                        type="text"
                        value={newVoiceName}
                        onChange={e => setNewVoiceName(e.target.value)}
                        placeholder="e.g. Bold, Playful, Technical..."
                        className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Additional Instructions</label>
                      <textarea
                        value={newVoiceInstructions}
                        onChange={e => setNewVoiceInstructions(e.target.value)}
                        placeholder="e.g. Always use active voice, avoid jargon..."
                        rows={5}
                        className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-vertical"
                      />
                    </div>
                    <div className="mt-6">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Enter asset (link, article, etc.)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAssetInput}
                          onChange={e => setNewAssetInput(e.target.value)}
                          placeholder="Paste a link to train the AI..."
                          className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                        />
                        <Button
                          className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold px-4"
                          onClick={() => {
                            if (newAssetInput.trim()) {
                              setNewVoiceAssets(prev => [...prev, newAssetInput.trim()]);
                              setNewAssetInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {newVoiceAssets.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {newVoiceAssets.map((asset, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span className="truncate max-w-[200px]">{asset}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setNewVoiceAssets(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* File upload for create modal */}
                    <div className="mt-6">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Upload files (PDF, DOCX, TXT, etc.)</label>
                      <input
                        type="file"
                        multiple
                        className="block w-full text-[#e4e4e7] bg-[#101010] border border-[#2e2f33] rounded-md p-2"
                        onChange={e => {
                          if (e.target.files && e.target.files.length > 0) {
                            setNewVoiceFiles(prev => [
                              ...prev,
                              ...Array.from(e.target.files ?? [])
                            ]);
                          }
                        }}
                      />
                      {newVoiceFiles.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {newVoiceFiles.map((file, idx) => (
                            <li key={file.name + idx} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span className="truncate max-w-[200px]">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setNewVoiceFiles(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mt-6">
                      <div className="text-[#e4e4e7] font-medium mb-2">People</div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {preselectedPeople.map((person) => (
                          <Button
                            key={person.username}
                            className={`px-3 py-1 rounded-full border border-[#2e2f33] text-[#e4e4e7] bg-[#101010] hover:bg-[#232323] text-sm ${voicePeople.some(p => p.username === person.username) ? 'bg-[#4ade80] text-black border-[#4ade80]' : ''}`}
                            onClick={() => {
                              if (!voicePeople.some(p => p.username === person.username)) {
                                setVoicePeople(prev => [...prev, person]);
                              }
                            }}
                          >
                            {person.name} <span className="ml-2 text-xs text-[#4ade80]">{person.username}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={addPersonInput}
                          onChange={e => setAddPersonInput(e.target.value)}
                          placeholder="Add X username (e.g. @naval)"
                          className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                        />
                        <Button
                          className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold px-4"
                          onClick={() => {
                            const username = addPersonInput.trim();
                            if (username && !voicePeople.some(p => p.username === username)) {
                              setVoicePeople(prev => [...prev, { name: username.replace('@', ''), username }]);
                              setAddPersonInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {voicePeople.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {voicePeople.map((person, idx) => (
                            <li key={person.username} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span>{person.name} <span className="ml-2 text-xs text-[#4ade80]">{person.username}</span></span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setVoicePeople(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button className="bg-black border border-white text-white hover:bg-[#18181b] flex-1" onClick={() => setShowCreateVoiceModal(false)}>
                        Close
                      </Button>
                      <Button
                        className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold flex-1"
                        onClick={() => {
                          const newId = brandVoices.length > 0 ? Math.max(...brandVoices.map(v => v.id)) + 1 : 1;
                          const newVoiceToAdd: BrandVoice = {
                            id: newId,
                            name: newVoiceName,
                            instructions: newVoiceInstructions,
                            assets: newVoiceAssets,
                            people: newVoicePeople,
                            files: newVoiceFiles,
                          };
                          setBrandVoices(prev => [...prev, newVoiceToAdd]);
                          setShowCreateVoiceModal(false);
                          // Reset form fields
                          setNewVoiceName("");
                          setNewVoiceInstructions("");
                          setNewVoiceAssets([]);
                          setNewAssetInput("");
                          setNewVoicePeople([]);
                          setNewAddPersonInput("");
                          setNewVoiceFiles([]);
                        }}
                      >
                        Create Voice
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit Existing Voice Modal */}
                <Dialog open={!!selectedVoiceModal} onOpenChange={() => setSelectedVoiceModal(null)}>
                  <DialogContent className="bg-[#18181b] border-[#4ade80] max-w-2xl mx-auto max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-[#4ade80]">Edit Voice: {selectedVoiceModal?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Additional Instructions</label>
                      <textarea
                        value={voiceInstructions}
                        onChange={e => setVoiceInstructions(e.target.value)}
                        placeholder="e.g. Always use active voice, avoid jargon..."
                        rows={5}
                        className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80] resize-vertical"
                      />
                    </div>
                     <div className="mt-6">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Enter asset (link, article, etc.)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={assetInput}
                          onChange={e => setAssetInput(e.target.value)}
                          placeholder="Paste a link to train the AI..."
                          className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                        />
                        <Button
                          className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold px-4"
                          onClick={() => {
                            if (assetInput.trim()) {
                              setVoiceAssets(prev => [...prev, assetInput.trim()]);
                              setAssetInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {voiceAssets.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {voiceAssets.map((asset, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span className="truncate max-w-[200px]">{asset}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setVoiceAssets(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                     {/* File upload for edit modal */}
                    <div className="mt-6">
                      <label className="block text-[#e4e4e7] mb-2 font-medium">Upload files (PDF, DOCX, TXT, etc.)</label>
                      <input
                        type="file"
                        multiple
                        className="block w-full text-[#e4e4e7] bg-[#101010] border border-[#2e2f33] rounded-md p-2"
                        onChange={e => {
                          if (e.target.files && e.target.files.length > 0) {
                            setVoiceFiles(prev => [
                              ...prev,
                              ...Array.from(e.target.files ?? [])
                            ]);
                          }
                        }}
                      />
                      {voiceFiles.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {voiceFiles.map((file, idx) => (
                            <li key={file.name + idx} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span className="truncate max-w-[200px]">{file.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setVoiceFiles(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mt-6">
                      <div className="text-[#e4e4e7] font-medium mb-2">People</div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {preselectedPeople.map((person) => (
                          <Button
                            key={person.username}
                            className={`px-3 py-1 rounded-full border border-[#2e2f33] text-[#e4e4e7] bg-[#101010] hover:bg-[#232323] text-sm ${voicePeople.some(p => p.username === person.username) ? 'bg-[#4ade80] text-black border-[#4ade80]' : ''}`}
                            onClick={() => {
                              if (!voicePeople.some(p => p.username === person.username)) {
                                setVoicePeople(prev => [...prev, person]);
                              }
                            }}
                          >
                            {person.name} <span className="ml-2 text-xs text-[#4ade80]">{person.username}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={addPersonInput}
                          onChange={e => setAddPersonInput(e.target.value)}
                          placeholder="Add X username (e.g. @naval)"
                          className="w-full p-2 rounded-md bg-[#101010] border border-[#2e2f33] text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
                        />
                        <Button
                          className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold px-4"
                          onClick={() => {
                            const username = addPersonInput.trim();
                            if (username && !voicePeople.some(p => p.username === username)) {
                              setVoicePeople(prev => [...prev, { name: username.replace('@', ''), username }]);
                              setAddPersonInput("");
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {voicePeople.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {voicePeople.map((person, idx) => (
                            <li key={person.username} className="flex items-center justify-between bg-[#101010] border border-[#2e2f33] rounded px-3 py-2 text-[#e4e4e7] text-sm">
                              <span>{person.name} <span className="ml-2 text-xs text-[#4ade80]">{person.username}</span></span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 text-red-400 hover:text-red-600"
                                onClick={() => setVoicePeople(prev => prev.filter((_, i) => i !== idx))}
                              >
                                ✕
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button className="bg-black border border-white text-white hover:bg-[#18181b] flex-1" onClick={() => setSelectedVoiceModal(null)}>
                        Close
                      </Button>
                      <Button className="bg-[#4ade80] text-black hover:bg-[#22c55e] font-semibold flex-1" onClick={() => {
                        if (selectedVoiceModal) {
                          setBrandVoices(prev => prev.map(v =>
                            v.id === selectedVoiceModal.id
                              ? { ...v, instructions: voiceInstructions, assets: voiceAssets, people: voicePeople, files: voiceFiles }
                              : v
                          ));
                        }
                        setSelectedVoiceModal(null);
                      }}>
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
                      {brandVoices.map((voice: BrandVoice) => (
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
                      <path d="m21 15-3.086-3.086a2 2 0 0 1-2.828 0L6 21"/>
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

        {/* Bottom left account popover */}
        <div className="fixed bottom-4 left-4 z-30">
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-black border border-[#2e2f33] rounded-xl px-4 py-3 flex items-center gap-3 min-w-[180px] hover:bg-[#18181b] transition-colors">
                <Avatar>
                  <AvatarImage src={activeAccount.avatar} />
                  <AvatarFallback>{activeAccount.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-[#e4e4e7]">{activeAccount.name}</span>
                  <span className="text-xs text-[#71717a]">{activeAccount.username}</span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
              <div className="py-2">
                {mockAccounts.map(account => (
                  <button
                    key={account.id}
                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#18181b] transition-colors ${account.id === activeAccount.id ? 'bg-[#18181b]' : ''}`}
                    onClick={() => setActiveAccount(account)}
                  >
                    <Avatar>
                      <AvatarImage src={account.avatar} />
                      <AvatarFallback>{account.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-[#e4e4e7]">{account.name}</span>
                      <span className="text-xs text-[#71717a]">{account.username}</span>
                    </div>
                    {account.id === activeAccount.id && (
                      <span className="ml-auto text-xs text-green-400 font-semibold">Active</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#2e2f33] px-4 py-2 flex flex-col gap-2">
                <button className="text-left text-sm text-[#4ade80] hover:underline">+ Add account</button>
                <button className="text-left text-sm text-[#e4e4e7] hover:underline">Manage accounts</button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};