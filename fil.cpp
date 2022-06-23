/*
*  File:        filler.cpp
*  Description: Implementation of functions in the filler namespace.
*
*/

/*
*  Performs a flood fill using breadth first search.
*
*  PARAM:  config - FillerConfig struct to setup the fill
*  RETURN: animation object illustrating progression of flood fill algorithm
*/
animation filler::FillBFS(FillerConfig& config) {
  // complete your implementation below
  // You should replace the following line with a
  // correct call to fill.
  
  return Fill<Queue>(config);
}

/*
*  Performs a flood fill using depth first search.
*
*  PARAM:  config - FillerConfig struct to setup the fill
*  RETURN: animation object illustrating progression of flood fill algorithm
*/
animation filler::FillDFS(FillerConfig& config) {
  // complete your implementation below
  // You should replace the following line with a
  // correct call to fill.
  return Fill<Stack>(config);
}

/*
*  Run a flood fill on an image starting at the seed point
*
*  PARAM:  config - FillerConfig struct with data for flood fill of image
*  RETURN: animation object illustrating progression of flood fill algorithm
*/
template <template <class T> class OrderingStructure> animation filler::Fill(FillerConfig& config)
{
  /*
  * You need to implement this function!
  *
  * This is the basic description of a flood-fill algorithm: Every fill
  * algorithm requires an ordering structure, which is passed to this
  * function via its template parameter. For a breadth-first-search
  * fill, that structure is a Queue, for a depth-first-search, that
  * structure is a Stack. To begin the algorithm, you simply place the
  * given point in the ordering structure, marking it processed
  * (the way you mark it is a design decision you'll make yourself).
  * We have a choice to either change the color, if appropriate, when we
  * add the point to the OS, or when we take it off. In our test cases,
  * we have assumed that you will change the color when a point is removed
  * from the structure.
  * Until the structure is empty, you do the following:
  *
  * 1.     Remove a point from the ordering structure, and then...
  *
  *        1.    add its unprocessed neighbors (up/down/left/right) whose color values are
  *              within (or equal to) tolerance distance from the seed point,
  *              to the ordering structure, and
  *              mark them as processed.
  *        2.    if it is an appropriate frame, send the current PNG to the
  *              animation (as described below).
  *
  * 2.     When implementing your breadth-first-search and
  *        depth-first-search fills, you will need to explore neighboring
  *        pixels (up/down/left/right) in some order.
  *
  *        While the order in which you examine neighbors does not matter
  *        for a proper fill, you must use the same order as we do for
  *        your animations to come out like ours! The order you should put
  *        neighboring pixels **ONTO** the queue or stack is as follows:
  *        1. northern neighbour (up)
  *        2. eastern neighbour (right)
  *        3. southern neighbour (down)
  *        4. western neighbour (left)
  * 
  *        If you process the neighbours in a different order, your fill may
  *        still work correctly, but your animations will be different
  *        from the grading scripts!
  *
  * 3.     For every k pixels filled, **starting at the kth pixel**, you
  *        must add a frame to the animation, where k = frameFreq.
  *
  *        For example, if frameFreq is 4, then after the 4th pixel has
  *        been filled you should add a frame to the animation, then again
  *        after the 8th pixel, etc.  You must only add frames for the
  *        number of pixels that have been filled, not the number that
  *        have been checked. So if frameFreq is set to 1, a pixel should
  *        be filled every frame.
  *
  * 4.     Finally, as you leave the function, send one last frame to the
  *        animation. This frame will be the final result of the fill, and
  *        it will be the one we test against.
  *
  */

  int framecount = 0; // increment after processing one pixel; used for producing animation frames (step 3 above)
  animation anim;
  OrderingStructure<PixelPoint> os;
  vector<PixelPoint> visited;
  os.Add(config.seedpoint);
  PixelPoint seedNoColor;
  seedNoColor.x = config.seedpoint.x;
  seedNoColor.y = config.seedpoint.y;
  visited.push_back(seedNoColor);
  // complete your implementation below
  // HINT: you will likely want to declare some kind of structure to track
  //       which pixels have already been visited
  int count = 0;
  while (!os.IsEmpty()) {
    PixelPoint pp = os.Remove();
    RGBAPixel* ppixel = config.img.getPixel(pp.x, pp.y);
    *ppixel = (*config.picker)(pp);
    if (framecount % config.frameFreq == 0)
      anim.addFrame(config.img);
    framecount++;

    if ((int) pp.y - 1 >= 0 && 0 <= (int) pp.x  && (int) pp.x < (int) config.img.width()) {
      PixelPoint next3;
      next3.x = pp.x;
      next3.y = pp.y - (unsigned int) 1;
      if (checkValid(visited, next3, config, config.seedpoint.color))
      {
        os.Add(next3); 
        visited.push_back(next3);
      }
    }
    if ((int) pp.x + 1 < (int) config.img.width() && 0 <= (int) pp.y && (int) pp.y < (int) config.img.height()) {
      PixelPoint next2;
      next2.x = pp.x + (unsigned int) 1;
      next2.y = pp.y;
      if (checkValid(visited, next2, config, config.seedpoint.color))
      {
        os.Add(next2); 
        visited.push_back(next2);
      }
    }
    if ((int) pp.y + 1 < (int) config.img.height() && 0 <= (int) pp.x && (int) pp.x < (int) config.img.width()) {
      PixelPoint next1;
      next1.x = pp.x;
      next1.y = pp.y + (unsigned int) 1;
      if (checkValid(visited, next1, config, config.seedpoint.color))
      {
        os.Add(next1);
        visited.push_back(next1);
      }
    }
    if ((int) pp.x - 1 >= 0 && 0 <= (int) pp.y && (int) pp.y < (int) config.img.height()) {
      PixelPoint next4;
      next4.x = pp.x - (unsigned int) 1;
      next4.y = pp.y;
      if (checkValid(visited, next4, config, config.seedpoint.color))
      {
        os.Add(next4); 
        visited.push_back(next4);
      }
    } 
    count++;
  }
  anim.addFrame(config.img);
  return anim;
}

bool filler::checkValid(vector<PixelPoint> vec, PixelPoint& p, FillerConfig& config, RGBAPixel seed) {
  bool valid = true;
  RGBAPixel* pixel = config.img.getPixel(p.x, p.y);
  double dist = pixel->dist(seed);
  cout << dist << endl;
  if (dist <= config.tolerance)
    valid = true;
  else
    valid = false;
  for (auto& px : vec) {
    if (px == p)
      valid = false;
  }
  return valid;
}

