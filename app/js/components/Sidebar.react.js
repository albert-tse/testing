import React from 'react';

class Sidebar extends React.Component {

	render() {
		return (
            <aside id="sidebar">
                <div className="wrapper">
                    <section>
                        <h2>Select Sources</h2>
                        <select id="source">
                            <option value="52">Above Average (Disabled) - aboveaverage.com</option>
                            <option value="86">All Day - allday.com</option>
                            <option value="3184">All Night - allnight.com</option>
                            <option value="3180">ArtNet News (Disabled) - news.artnet.com</option>
                            <option value="3166">Destination Tips - destinationtips.com</option>
                            <option value="50">Diply (1 Page) - trendy-joe.diply.com</option>
                            <option value="3147">Diply (4-Page) - trendyjoe.diply.com</option>
                            <option value="53">Distractify - distractify.com</option>
                            <option value="71">Dose - dose.com</option>
                            <option value="55">Earthporm - earthporm.com</option>
                            <option value="35">Guff (Disabled) - guff.com</option>
                            <option value="34">Higher Perspectives - higherperspectives.com</option>
                            <option value="3159">Historical Times - historicaltimes.com/category/trending</option>
                            <option value="3137">Larry King Now - ora.tv/larrykingnow</option>
                            <option value="2788">LifeBuzz - lifebuzz.com</option>
                            <option value="75">LiftBump - liftbump.com</option>
                            <option value="49">Matador Network - matadornetwork.com</option>
                            <option value="80">Queerty - queerty.com</option>
                            <option value="58">Simple Organic Life - simpleorganiclife.org</option>
                            <option value="2459">VICE (Disabled) - vice.com</option>
                            <option value="22">ViraLands - viralands.com</option>
                            <option value="43">ViralThread (Disabled) - viralthread.com</option>
                            <option value="42">Vocativ - vocativ.com</option>
                            <option value="3174">WTFark - ora.tv/wtfark</option>
                        </select>
                    </section>
                    <section>
                        <h2>Filter By Date</h2>
                        <div id="filter-by-date-picker"></div>
                    </section>
                    <section>
                        <h2>Sort By</h2>
                        <select id="sort-by" className="form-control">
                            <option value="random">Random</option>
                            <option value="stat_type_95 desc">Performance</option>
                            <option value="creation_date desc">Date Published</option>
                            <option value="ucid desc">Date Added</option>
                            <option value="_score desc">Relevance</option>
                            <option value="site_id desc">Site</option>
                            <option value="title asc">Title</option>
                        </select>
                    </section>
                </div>
            </aside>
        );
	}
	
}

export default Sidebar;
