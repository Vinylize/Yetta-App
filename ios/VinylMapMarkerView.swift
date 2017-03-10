//
//  VinylMapMarkerView.swift
//  pingstersApp
//
//  Created by Youngchan Je on 3/9/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

public class VinylMapMarkerView: UIView {
  override init(frame : CGRect) {
    super.init(frame : frame)
    backgroundColor = UIColor.brown
  }
  
  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }
}
