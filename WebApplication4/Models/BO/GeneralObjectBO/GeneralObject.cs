using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO.StoriesBO;

namespace WebApplication4.Models.BO
{
    public class GeneralObject
    {
        public List<Projet> projets {get; set;}

        public void SaveToDb(bool isFactu)
        {
            switch (isFactu)
            {
                case false:
                    foreach (Projet p in this.projets)
                    {
                        p.save();
                        foreach (MasterStories s in p.Stories)
                        {
                            StoriesBO.Stories_d stories_d = new StoriesBO.Stories_d(s);
                            stories_d.save();
                            foreach (MasterTasks ts in s.Tasks)
                            {
                                Tasks_d tasks_d = new Tasks_d(ts);
                                tasks_d.save();
                            }
                        }
                    }
                    break;

                case true:
                    foreach (Projet p in this.projets)
                    {
                        p.save();
                        foreach (MasterStories s in p.Stories)
                        {
                            StoriesBO.Stories_f stories_f = new StoriesBO.Stories_f(s);
                            stories_f.save();
                            foreach (MasterTasks ts in s.Tasks)
                            {
                                Tasks_f tasks_f = new Tasks_f(ts);
                                tasks_f.save();
                            }
                        }
                    }
                    break;
            }
            
        }
    }
}